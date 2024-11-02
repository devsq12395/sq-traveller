import { supabase } from './supabaseClient';

// Fetch budget items for a specific event
export async function fetchEventBudgets(eventId) {
  const { data, error } = await supabase
    .from('budget')
    .select('id, budget_name, budget_price')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching budgets:', error.message);
    return { error };
  }
  return { data };
}

// Add a new budget item for an event
export async function addBudget(eventId, budgetName, budgetPrice) {
  const { data, error } = await supabase
    .from('budget')
    .insert({ event_id: eventId, budget_name: budgetName, budget_price: budgetPrice });

  if (error) {
    console.error('Error adding budget item:', error.message);
    return { error };
  }
  return { data };
}
