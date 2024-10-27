import { supabase } from './supabaseClient';
import { setUser } from '../context/UserContext';

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

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      return error;
    }
  
    // Ensure email confirmation
    if (!data.user?.confirmed_at) {
      return { message: 'Email not confirmed. Please check your email and confirm it before logging in.' };
    }
  
    // Fetch user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('username')
      .eq('user_id', data.user.id)
      .single();
  
    if (profileError) {
      return profileError;
    }
  
    // Set user data in context
    setUser({
      username: profile.username,
      email: data.user.email,
      user_id: data.user.id,
    });
  
    return null;
}

// Logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return error;
}
