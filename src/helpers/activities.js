import { supabase } from './supabaseClient';

// Fetch activities for a specific event
export async function fetchEventActivities(eventId) {
  const { data, error } = await supabase
    .from('activities')
    .select('id, activity_name, is_checked')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching activities:', error.message);
    return { error };
  }
  return { data };
}

// Update the completion status of an activity
export async function updateActivityStatus(activityId, isChecked) {
  const { error } = await supabase
    .from('activities')
    .update({ is_checked: isChecked })
    .eq('id', activityId);

  if (error) {
    console.error('Error updating activity status:', error.message);
    return { error };
  }
  return { success: true };
}

// Add a new activity for an event
export async function addActivity(eventId, activityName) {
  const { data, error } = await supabase
    .from('activities')
    .insert({ event_id: eventId, activity_name: activityName, is_checked: false });

  if (error) {
    console.error('Error adding activity:', error.message);
    return { error };
  }
  return { data };
}
