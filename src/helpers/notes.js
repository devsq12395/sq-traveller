import { supabase } from '../supabaseClient';

// Fetch notes for a specific event
export async function fetchEventNotes(eventId) {
  const { data, error } = await supabase
    .from('notes')
    .select('id, note')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching notes:', error.message);
    return { error };
  }
  return { data };
}

// Add a new note for an event
export async function addNote(eventId, noteContent) {
  const { data, error } = await supabase
    .from('notes')
    .insert({ event_id: eventId, note: noteContent });

  if (error) {
    console.error('Error adding note:', error.message);
    return { error };
  }
  return { data };
}
