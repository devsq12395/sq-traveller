import { supabase } from './supabaseClient';

export async function getUserDetails(username) {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('user_id')
      .eq('username', username)
      .single();

    if (error) {
      return error;
    }

    data.username = username;
    data.avatar_url = data.avatar_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984918/sq-traveller/d1smxewhudxzqaw2v0br.png';
    data.banner_url = data.banner_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984919/sq-traveller/fee8n8wqws5ly6rvtkt6.jpg';

    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

export async function checkIfUsernameExists(username) {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('username')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error checking username existence:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkIfUsernameExists:', error);
    return false;
  }
}