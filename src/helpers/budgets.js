import { supabase } from './supabaseClient';
import { fetchItineraryEvents } from './event';

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

// Calculate total budget for all events in an itinerary
export async function calculateTotalBudget(itineraryId) {
  const { data: events, error: eventsError } = await fetchItineraryEvents(itineraryId);
  if (eventsError) {
    return { error: eventsError };
  }

  let total = 0;
  for (const event of events) {
    const { data: budgets, error: budgetError } = await fetchEventBudgets(event.id);
    if (budgetError) {
      return { error: budgetError };
    }
    total += budgets.reduce((sum, item) => sum + item.budget_price, 0);
  }

  return { total };
}
