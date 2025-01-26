import { supabase } from './supabaseClient';
import axios from 'axios';

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

export async function uploadAvatar(file) {
  if (!file) return;

  try {
    const uploadPreset = process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryUrl = process.env.VUE_APP_CLOUDINARY_URL;

    if (!uploadPreset || !cloudinaryUrl) {
      console.error("Cloudinary environment variables are missing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}

export async function uploadBanner(file) {
  if (!file) return;

  try {
    const uploadPreset = process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryUrl = process.env.VUE_APP_CLOUDINARY_URL;

    if (!uploadPreset || !cloudinaryUrl) {
      console.error("Cloudinary environment variables are missing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading banner:", error);
    throw error;
  }
}

export async function updateUserDetail(userId, updates) {
  if (!updates.username && !updates.bio) return;

  try {
    const { data, error } = await supabase
      .from('profile')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
}