import { supabase } from './supabaseClient';

export async function addReport(itineraryId, userId, report) {
  const { data, error } = await supabase
    .from('itinerary_report')
    .insert([
      {
        itinerary_id: itineraryId,
        user_id: userId,
        report: report,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.error('Error adding report:', error);
    return { error };
  }

  return { data };
}