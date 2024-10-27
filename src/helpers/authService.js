import { supabase } from './supabaseClient';

// Signup function
export async function signup(username, email, password) {
  // Create a new user
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return error;
  }

  // Create a new profile for the user
  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase
      .from('profile')
      .insert([{ user_id: userId, username }]);
    if (profileError) {
      return profileError;
    }
  }

  return null;
}

// Login function
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error;
}

// Logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return error;
}
