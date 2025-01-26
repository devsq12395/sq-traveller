import { supabase } from './supabaseClient';
import { fetchAverageRating } from './itineraryRatings';

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
      id, created_at, name, description, days,
      itinerary_img (img_url)
    `)
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching itineraries:', error.message);
    return { error: 'Itineraries not found', status: 404 };
  }

  if (data.length === 0) {
    console.error('No itineraries found for the user:', user_id);
    return { error: 'Itineraries not found', status: 404 };
  }

  // Adjust time fields and handle nested itinerary_img data
  const adjustedData = data.map(itinerary => {
    // Access the first img_url from the itinerary_img array or use the placeholder
    const img_url = itinerary.itinerary_img && itinerary.itinerary_img.length > 0 ? itinerary.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
    return {
      ...itinerary,
      img_url,
    };
  });

  return { data: adjustedData };
}

// Fetch a single itinerary by ID
export async function fetchItinerary(itineraryId, currentUserId) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to fetch the itinerary.' };
  }

  try {

    const { data: privacyData, error: privacyError } = await fetchItineraryPrivacy(itineraryId);

    if (privacyError) {
      console.error('Error fetching privacy setting:', privacyError.message);
      return { error: 'Itinerary not found', status: 404 };
    }

    const privacy = privacyData?.privacy || 'private'; // Default to private if none exists

    // Fetch the itinerary details
    const { data: itineraryData, error: itineraryError } = await supabase
      .from('itinerary')
      .select(`
        *,
        itinerary_img (img_url),
        profiles:user_id (username)
      `)
      .eq('id', itineraryId)
      .single();

    if (itineraryError) {
      console.error('Error fetching itinerary:', itineraryError.message);
      return { error: 'Itinerary not found', status: 404 };
    }

    if (!itineraryData || itineraryData.length === 0) {
      console.error('Itinerary not found:', itineraryId);
      return { error: 'Itinerary not found', status: 404 };
    }

    const itinerary = itineraryData;

    const isOwner = currentUserId ? itinerary.user_id === currentUserId : false;

    // If private and not owner or not logged in, deny access
    if (privacy === 'private' && (!currentUserId || !isOwner)) {
      return { error: 'This itinerary is private', isPrivate: true };
    }

    // Format the response
    const formattedData = {
      ...itinerary,
      img_url: (itinerary.itinerary_img && itinerary.itinerary_img.length > 0) ? itinerary.itinerary_img[0].img_url : 'https://via.placeholder.com/150',
      creatorName: itinerary.profiles?.username || 'Unknown User',
      privacy: privacy,
      isOwner: isOwner
    };

    return { data: formattedData };
  } catch (error) {
    console.error('Error in fetchItinerary:', error.message);
    return { error: 'Itinerary not found', status: 404 };
  }
}

// Fetch itinerary with creator information
export async function fetchItineraryWithCreator(itineraryId) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to fetch the itinerary.' };
  }

  try {
    const { data: privacyData, error: privacyError } = await fetchItineraryPrivacy(itineraryId);

    if (privacyError) {
      console.error('Error fetching privacy setting:', privacyError.message);
      return { error: privacyError };
    }

    const privacy = privacyData?.privacy || 'private'; // Default to private if none exists

    const { data, error } = await supabase
      .from('itinerary')
      .select(`
        id, created_at, name, description, days,
        itinerary_img (img_url),
        user_id,
        profiles:user_id (username)
      `)
      .eq('id', itineraryId)
      .single();

    if (error) throw error;

    // Access the first img_url from the itinerary_img or use the placeholder
    const img_url = data.itinerary_img && data.itinerary_img.length > 0 ? data.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
    const creatorName = data.profiles?.username || 'Unknown User';
    
    const adjustedData = { 
      ...data, 
      img_url,
      creatorName,
      privacy
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
      .eq('itinerary_id', itineraryId);

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error('Error fetching itinerary privacy:', error.message);
      return { error };
    }

    // If no privacy setting exists, create one with default 'private' setting
    if (!data || data.length === 0) {
      const { data: existingData, error: existingError } = await supabase
        .from('itinerary_privacy')
        .select('privacy')
        .eq('itinerary_id', itineraryId);

      if (existingError) {
        console.error('Error checking existing privacy setting:', existingError.message);
        return { error: existingError };
      }

      if (!existingData || existingData.length === 0) {
        try {
          const { data: newData, error: insertError } = await supabase
            .from('itinerary_privacy')
            .insert([{ itinerary_id: itineraryId, privacy: 'private' }])
            .select();

          if (insertError) {
            // Handle unique constraint violation
            if (insertError.code === '23505') { // Unique violation error code
              console.warn('Privacy setting already exists for itineraryId:', itineraryId);
              return fetchItineraryPrivacy(itineraryId); // Retry fetching
            }
            console.error('Error creating default privacy setting:', insertError.message);
            return { error: insertError };
          }

          return { data: newData };
        } catch (insertError) {
          console.error('Error in transaction:', insertError.message);
          return { error: insertError };
        }
      } else {
        return { data: existingData[0] };
      }
    }

    return { data: data[0] };
  } catch (error) {
    console.error('Error in fetchItineraryPrivacy:', error.message);
    return { error };
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

// Update privacy setting for an itinerary
export async function updateItineraryPrivacy(itineraryId, privacy) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to update privacy.' };
  }

  if (!['private', 'public', 'shared'].includes(privacy)) {
    console.error('Invalid privacy setting:', privacy);
    return { error: 'Privacy must be either private, public, or shared.' };
  }

  try {
    // First check if a privacy setting exists
    const { data: existingPrivacy, error: checkError } = await supabase
      .from('itinerary_privacy')
      .select('id')
      .eq('itinerary_id', itineraryId);

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing privacy:', checkError);
      return { error: checkError };
    }

    let updateResult;
    if (existingPrivacy) {
      // Update existing privacy setting
      updateResult = await supabase
        .from('itinerary_privacy')
        .update({ privacy })
        .eq('itinerary_id', itineraryId);
    } else {
      // Insert new privacy setting
      updateResult = await supabase
        .from('itinerary_privacy')
        .insert([{ itinerary_id: itineraryId, privacy }]);
    }

    const { error: updateError } = updateResult;
    if (updateError) {
      console.error('Error updating privacy:', updateError);
      return { error: updateError };
    }

    return { data: { privacy } };
  } catch (error) {
    console.error('Error in updateItineraryPrivacy:', error);
    return { error: error.message };
  }
}

// Edit an existing itinerary
export async function editItinerary(itineraryId, details) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to edit the itinerary.' };
  }

  const { data, error } = await supabase
    .from('itinerary')
    .update(details)
    .eq('id', itineraryId);

  if (error) {
    console.error('Error editing itinerary:', error.message);
    return { error: 'Failed to edit itinerary', status: 500 };
  }

  return { data };
}

// Fetch shared itineraries
export async function fetchSharedItineraries({ page = 1, pageSize = 12 } = {}) {
  try {
    // First, get total count
    const { count, error: countError } = await supabase
      .from('itinerary')
      .select('*, itinerary_privacy!inner(privacy)', { count: 'exact' })
      .eq('itinerary_privacy.privacy', 'shared');

    if (countError) {
      console.error('Error getting total count:', countError);
      return { error: countError };
    }

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('itinerary')
      .select(`
        *,
        itinerary_img (img_url),
        profiles:user_id (username),
        itinerary_privacy!inner (privacy)
      `)
      .eq('itinerary_privacy.privacy', 'shared')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching public itineraries:', error);
      return { error };
    }

    // Format the response
    const formattedData = data.map(itinerary => ({
      ...itinerary,
      img_url: itinerary.itinerary_img && itinerary.itinerary_img.length > 0 ? itinerary.itinerary_img[0].img_url : 'https://via.placeholder.com/150',
      creatorName: itinerary.profiles?.username || 'Unknown User',
    }));

    return { 
      data: formattedData,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    console.error('Error in fetchSharedItineraries:', error);
    return { error: error.message };
  }
}

// Search itineraries by terms
export async function searchItineraries(searchTerm, { page = 1, pageSize = 12 } = {}) {
  try {
    // First, get total count with search term
    const { count, error: countError } = await supabase
      .from('itinerary')
      .select('*, itinerary_privacy!inner(privacy)', { count: 'exact' })
      .eq('itinerary_privacy.privacy', 'shared')
      .ilike('name', `%${searchTerm}%`);

    if (countError) {
      console.error('Error getting total count with search term:', countError);
      return { error: countError };
    }

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('itinerary')
      .select(`
        *,
        itinerary_img (img_url),
        profiles:user_id (username),
        itinerary_privacy!inner (privacy)
      `)
      .eq('itinerary_privacy.privacy', 'shared')
      .ilike('name', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error searching itineraries:', error);
      return { error };
    }

    // Format the response
    const formattedData = data.map(itinerary => ({
      ...itinerary,
      img_url: itinerary.itinerary_img && itinerary.itinerary_img.length > 0 ? itinerary.itinerary_img[0].img_url : 'https://via.placeholder.com/150',
      creatorName: itinerary.profiles?.username || 'Unknown User',
    }));

    return { 
      data: formattedData,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    console.error('Error in searchItineraries:', error);
    return { error: error.message };
  }
}

// Fetch all shared itineraries of a user
export async function getAllsharedItinerariesOfUser(userId) {
  try {
    const { data, error } = await supabase
      .from('itinerary')
      .select(`
        id, name, description, created_at, days,
        itinerary_img (img_url),
        itinerary_privacy (privacy)
      `)
      .eq('user_id', userId)
      .eq('itinerary_privacy.privacy', 'shared');

    if (error) {
      console.error('Error fetching public itineraries:', error.message);
      return { error };
    }

    // Filter out itineraries where itinerary_privacy is not 'shared'
    const filteredData = data.filter(itinerary => {
      return itinerary.itinerary_privacy.some(priv => priv.privacy === 'shared');
    });

    // Adjust time fields and handle nested itinerary_img data
    const adjustedData = await Promise.all(filteredData.map(async itinerary => {
      // Access the first img_url from the itinerary_img array or use the placeholder
      const img_url = itinerary.itinerary_img && itinerary.itinerary_img.length > 0 ? itinerary.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
      const averageRating = await fetchAverageRating(itinerary.id);
      return {
        ...itinerary,
        img_url,
        averageRating
      };
    }));

    return { data: adjustedData, error: null };
  } catch (error) {
    console.error('Unexpected error fetching public itineraries:', error);
    return { error };
  }
}
