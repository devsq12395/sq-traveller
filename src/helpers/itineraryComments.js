import { supabase } from './supabaseClient';

export async function fetchComments(itineraryId) {
  const { data, error } = await supabase
    .from('itinerary_comment')
    .select(`
      *,
      profile:user_id (
        username
      )
    `)
    .eq('itinerary_id', itineraryId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return { error };
  }

  return { data };
}

export async function addComment(itineraryId, userId, comment) {
  const { data, error } = await supabase
    .from('itinerary_comment')
    .insert([
      {
        itinerary_id: itineraryId,
        user_id: userId,
        comment: comment,
      },
    ])
    .select(`
      *,
      profile:user_id (
        username
      )
    `)
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return { error };
  }

  return { data };
}

export async function deleteComment(commentId, userId) {
  const { error } = await supabase
    .from('itinerary_comment')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId); // Ensure user can only delete their own comments

  if (error) {
    console.error('Error deleting comment:', error);
    return { error };
  }

  return { error: null };
}
