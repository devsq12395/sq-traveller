import { supabase } from './supabaseClient';

// Fetch todos for a specific event
export async function fetchEventTodos(eventId) {
  const { data, error } = await supabase
    .from('todos')
    .select('id, todo')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching todos:', error.message);
    return { error };
  }
  return { data };
}

// Add a new todo for an event
export async function addTodo(eventId, todoContent) {
  const { data, error } = await supabase
    .from('todos')
    .insert({ event_id: eventId, todo: todoContent });

  if (error) {
    console.error('Error adding todo:', error.message);
    return { error };
  }
  return { data };
}

// Delete a todo
export async function deleteTodo(todoId) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId);

  if (error) {
    console.error('Error deleting todo:', error.message);
    return { error };
  }
  return { success: true };
}
