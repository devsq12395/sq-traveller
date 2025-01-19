const { supabase } = require('./supabaseClient');

async function getAllFeaturedItineraries() {
    try {
        const { data, error } = await supabase
            .from('itinerary_featured')
            .select('itinerary(*)');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching featured itineraries:', error);
        throw error;
    }
}

module.exports = {
    getAllFeaturedItineraries
};