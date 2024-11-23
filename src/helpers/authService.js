import { supabase } from './supabaseClient';
import { setUser } from '../context/UserContext';

// Login function
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

  // Set user data in context and local storage
  setUser({
    username: profile.username,
    email: data.user.email,
    user_id: data.user.id,
  });

  return null;
}

// Signup function
export async function signup(email, password, username) {
  // First, create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  });

  if (authError) {
    return { error: authError };
  }

  // Create profile record
  const { error: profileError } = await supabase
    .from('profile')
    .insert([
      {
        user_id: authData.user.id,
        username: username,
        email: email,
      },
    ]);

  if (profileError) {
    // If profile creation fails, we should probably cleanup the auth user
    // but Supabase doesn't provide a direct way to delete users
    return { error: profileError };
  }

  return {
    data: {
      message: 'Signup successful! Please check your email to confirm your account.',
      user: authData.user,
    },
    error: null,
  };
}

// Logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return error;
}

// Get profile data
export async function getProfileData() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profile')
      .select('username')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in getProfileData:', error);
    return null;
  }
}
