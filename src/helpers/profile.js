export async function getUserDetails(username) {
  try {
    const response = await fetch(`/api/users/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}