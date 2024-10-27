import { supabase } from './supabaseClient';

// Login function
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error;
}

// Signup function
export async function signup(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  return error;
}

// Logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return error;
}
