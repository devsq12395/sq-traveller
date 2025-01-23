import { supabase } from './supabaseClient';
import { checkIfUsernameExists } from './profile';
import { setUser, clearUser } from '../context/UserContext';

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
    .select('username','avatar_url','banner_url','bio')
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
    avatar_url: data.user.avatar_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984918/sq-traveller/d1smxewhudxzqaw2v0br.png',
    banner_url: data.user.banner_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984919/sq-traveller/fee8n8wqws5ly6rvtkt6.jpg',
    bio:data.user.bio
  });

  return null;
}

// Signup function
export async function signup(email, password, username) {
  try {
    // Check if the username already exists
    const usernameExists = await checkIfUsernameExists(username);
    if (usernameExists) {
      return { error: { message: 'Username already taken. Please choose a different username.' } };
    }

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

    // Handle auth errors
    if (authError) {
      console.error('Auth signUp error:', authError.message);
      return { error: authError };
    }

    // Check if user is available (email confirmation may delay availability)
    if (!authData.user) {
      console.error('User not available. Email confirmation might be required.');
      return {
        error: {
          message: 'User signup successful, but email confirmation is required.',
        },
      };
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from('profile')
      .insert([
        {
          user_id: authData.user.id, // Ensure this matches RLS policies
          username: username,
        },
      ]);

    // Handle profile creation errors
    if (profileError) {
      console.error('Profile creation error:', profileError.message);

      // Cleanup: Consider prompting an admin or manually handling orphaned users
      return { error: profileError };
    }

    // Return success message
    return {
      data: {
        message: 'Signup successful! Please check your email to confirm your account.',
        user: authData.user,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected signup error:', err.message);
    return { error: { message: 'Unexpected error occurred during signup.' } };
  }
}

// Logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    clearUser(); // Clear user data from context and local storage
  }
  return error;
}

// Get profile data
export async function getProfileData() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profile')
      .select('username','avatar_url','banner_url','bio')
      .eq('user_id', user.id)
      .maybeSingle();

    profile.avatar_url = profile.avatar_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984918/sq-traveller/d1smxewhudxzqaw2v0br.png';
    profile.banner_url = profile.banner_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984919/sq-traveller/fee8n8wqws5ly6rvtkt6.jpg';

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

// Login with Google
export async function loginWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          window.location.origin === 'http://localhost:8080'
            ? 'http://localhost:8080'
            : 'https://goagenda.net',
      },
    });

    if (error) {
      console.error('Error logging in with Google:', error.message);
      return { error };
    }

    // Fetch authenticated user information
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error fetching session:', sessionError.message);
      return { error: sessionError };
    }

    const user = sessionData.session?.user;
    if (!user) {
      console.error('No authenticated user found.');
      return { error: { message: 'No authenticated user found.' } };
    }

    // Fetch user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('username', 'avatar_url', 'banner_url', 'bio')
      .eq('user_id', user.id) // Use the correct user ID from the authenticated session
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      return { error: profileError };
    }

    // Set user data in context and local storage
    try {
      setUser({
        username: profile.username,
        email: user.email,
        user_id: user.id,
        avatar_url:
          profile.avatar_url ||
          'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984918/sq-traveller/d1smxewhudxzqaw2v0br.png',
        banner_url:
          profile.banner_url ||
          'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984919/sq-traveller/fee8n8wqws5ly6rvtkt6.jpg',
        bio: profile.bio,
      });
    } catch (error) {
      console.error('Error setting user data:', error);
    }

    return { user };
  } catch (err) {
    console.error('Unexpected error during Google login:', err.message);
    return { error: { message: 'Unexpected error occurred during Google login.' } };
  }
}


// Login with Facebook
export async function loginWithFacebook() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });

    if (error) {
      console.error('Error logging in with Facebook:', error.message);
      return { error };
    }

    // The data object will contain the redirect URL to the Facebook login page
    return { data };
  } catch (err) {
    console.error('Unexpected error during Facebook login:', err.message);
    return { error: { message: 'Unexpected error occurred during Google login.' } };
  }
}

// Check if the currently logged-in user has a profile
export async function getUserHasProfile() {
  try {
    // Get the currently logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError.message);
      return { hasProfile: false, error: userError };
    }

    if (!user) {
      console.warn('No user is logged in.');
      return { hasProfile: false, error: null };
    }

    // Query the profile table to check if a profile exists for the user
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('id') // Only fetch the ID to minimize payload
      .eq('user_id', user.id)
      .maybeSingle(); // Use maybeSingle to avoid errors when 0 rows are returned

    if (profileError) {
      console.error('Error checking for profile:', profileError.message);
      return { hasProfile: false, error: profileError };
    }

    // Return whether the user has a profile
    return { hasProfile: !!profile, error: null };
  } catch (err) {
    console.error('Unexpected error in getUserHasProfile:', err.message);
    return { hasProfile: false, error: { message: 'Unexpected error occurred.' } };
  }
}

// Create a new profile for the currently logged-in user
export async function createProfile(username) {
  try {
    // Get the currently logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Check if the username already exists
    const usernameExists = await checkIfUsernameExists(username);
    if (usernameExists) {
      console.warn('Username already taken. Please choose a different username.');
      return { success: false, error: { message: 'Username already taken. Please choose a different username.' } };
    }
    
    if (userError) {
      console.error('Error getting user:', userError.message);
      return { success: false, error: userError };
    }

    if (!user) {
      console.warn('No user is logged in.');
      return { success: false, error: { message: 'User not logged in.' } };
    }

    // Insert a new profile for the logged-in user
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .insert([
        {
          user_id: user.id, // The user's ID
          username: username, // The provided username
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError.message);
      return { success: false, error: profileError };
    }

    return { success: true, profile, error: null };
  } catch (err) {
    console.error('Unexpected error in createProfile:', err.message);
    return { success: false, error: { message: 'Unexpected error occurred.' } };
  }
}
