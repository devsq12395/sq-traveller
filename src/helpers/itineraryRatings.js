import { supabase } from './supabaseClient';

export async function fetchRatings(itineraryId) {
  const { data, error } = await supabase
    .from('itinerary_rating')
    .select(`
      *,
      profile:user_id (
        username
      )
    `)
    .eq('itinerary_id', itineraryId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ratings:', error);
    return { error };
  }

  return { data };
}

export async function addRating(itineraryId, userId, rating, comment) {
  const { data, error } = await supabase
    .from('itinerary_rating')
    .insert([
      {
        itinerary_id: itineraryId,
        user_id: userId,
        rating: rating,
        comment: comment
      },
    ])
    .select(`
      *,
      comment,
      profile:user_id (
        username
      )
    `)
    .single();

  if (error) {
    console.error('Error adding rating:', error);
    return { error };
  }

  return { data };
}

export async function deleteRating(ratingId, userId) {
  const { error } = await supabase
    .from('itinerary_rating')
    .delete()
    .eq('id', ratingId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting rating:', error);
    return { error };
  }

  return { success: true };
}

export async function fetchAverageRating(itineraryId) {
  const { data, error } = await supabase
    .from('itinerary_rating')
    .select('rating')
    .eq('itinerary_id', itineraryId);

  if (error) {
    console.error('Error fetching average rating:', error);
    return 0;
  }

  const total = data.reduce((sum, rating) => sum + rating.rating, 0);
  return data.length > 0 ? total / data.length : 0;
}
