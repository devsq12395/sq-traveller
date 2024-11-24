import { supabase } from './supabaseClient';

// Fetch all itineraries for a specific user
export async function fetchItineraries(user_id) {
  if (!user_id) {
    console.error('User ID is null or undefined');
    return { error: 'User ID is required to fetch itineraries.' };
  }

  // Fetch itineraries and join with the itinerary_img table
  const { data, error } = await supabase
    .from('itinerary')
    .select(`
      id, name, description, days,
      itinerary_img (img_url)
    `)
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching itineraries:', error.message);
    return { error };
  }

  // Adjust time fields and handle nested itinerary_img data
  const adjustedData = data.map(itinerary => {
    // Access the first img_url from the itinerary_img array or use the placeholder
    const img_url = itinerary.itinerary_img?.length ? itinerary.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
    return {
      ...itinerary,
      img_url,
    };
  });

  return { data: adjustedData };
}

// Fetch a single itinerary by ID
export async function fetchItinerary(itineraryId) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to fetch the itinerary.' };
  }

  // Fetch the itinerary and join with the itinerary_img table
  const { data, error } = await supabase
    .from('itinerary')
    .select(`
      id, name, description, time_start, time_end,
      itinerary_img (img_url)
    `)
    .eq('id', itineraryId)
    .single();

  if (error) {
    console.error('Error fetching itinerary:', error.message);
    return { error };
  }

  // Access the first img_url from the itinerary_img or use the placeholder
  const img_url = data.itinerary_img?.length ? data.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
  const adjustedData = { ...data, img_url };

  return { data: adjustedData };
}

// Fetch itinerary with creator information
export async function fetchItineraryWithCreator(itineraryId) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to fetch the itinerary.' };
  }

  try {
    const { data, error } = await supabase
      .from('itinerary')
      .select(`
        id, name, description, days,
        itinerary_img (img_url),
        user_id,
        profiles:user_id (username)
      `)
      .eq('id', itineraryId)
      .single();

    if (error) throw error;

    // Access the first img_url from the itinerary_img or use the placeholder
    const img_url = data.itinerary_img?.length ? data.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
    const creatorName = data.profiles?.username || 'Unknown User';
    
    const adjustedData = { 
      ...data, 
      img_url,
      creatorName
    };

    return { data: adjustedData };
  } catch (error) {
    console.error('Error fetching itinerary:', error.message);
    return { 
      data: {
        name: '',
        description: '',
        days: 0,
        img_url: 'https://via.placeholder.com/150',
        creatorName: 'Unknown User'
      }, 
      error: error.message 
    };
  }
}

// Create a new itinerary
export async function createItinerary(userId, name, description, days) {
  try {
    const { data, error } = await supabase
      .from('itinerary')
      .insert({
        user_id: userId,
        name,
        description,
        days
      })
      .select();

    if (error) {
      console.error('Error creating itinerary in Supabase:', error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in createItinerary:', err.message);
    return { data: null, error: err.message };
  }
}

// Save the image URL to the itinerary_img table
export async function saveItineraryImage(itineraryId, imgUrl) {
  try {
    const { data, error } = await supabase
      .from('itinerary_img')
      .insert({
        itinerary_id: itineraryId,
        img_url: imgUrl,
      });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error saving itinerary image:', error.message);
    return { error };
  }
}

// Fetch privacy setting for an itinerary
export async function fetchItineraryPrivacy(itineraryId) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to fetch privacy settings.' };
  }

  try {
    const { data, error } = await supabase
      .from('itinerary_privacy')
      .select('privacy')
      .eq('itinerary_id', itineraryId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error('Error fetching itinerary privacy:', error.message);
      return { error };
    }

    // If no privacy setting exists, create one with default 'private' setting
    if (!data) {
      const { data: newData, error: insertError } = await supabase
        .from('itinerary_privacy')
        .insert([{ itinerary_id: itineraryId, privacy: 'private' }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating default privacy setting:', insertError.message);
        return { error: insertError };
      }

      return { data: newData };
    }

    return { data };
  } catch (error) {
    console.error('Error in fetchItineraryPrivacy:', error.message);
    return { error };
  }
}

// Update privacy setting for an itinerary
export async function updateItineraryPrivacy(itineraryId, privacy) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to update privacy settings.' };
  }

  if (!['private', 'public', 'shared'].includes(privacy)) {
    return { error: 'Invalid privacy setting.' };
  }

  try {
    // First check if a privacy setting exists
    const { data: existingData } = await supabase
      .from('itinerary_privacy')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .single();

    let result;
    
    if (existingData) {
      // Update existing privacy setting
      result = await supabase
        .from('itinerary_privacy')
        .update({ privacy })
        .eq('itinerary_id', itineraryId)
        .select();
    } else {
      // Create new privacy setting
      result = await supabase
        .from('itinerary_privacy')
        .insert([{ itinerary_id: itineraryId, privacy }])
        .select();
    }

    const { data, error } = result;
    if (error) throw error;

    return { data };
  } catch (error) {
    console.error('Error updating itinerary privacy:', error.message);
    return { error };
  }
}