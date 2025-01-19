const { supabase } = require('./supabaseClient');
import { fetchItineraryWithCreator } from './itinerary';

async function getAllFeaturedItineraries() {
    try {
        const { data, error } = await supabase
            .from('itinerary_featured')
            .select('itinerary(*)');

        const itinerariesCompleteData = await Promise.all(data.map(async (itinerary) => {
            itinerary = itinerary.itinerary;

            const { data: completeData, error } = await fetchItineraryWithCreator(itinerary.id);
            if (error) {
                console.error(`Error fetching complete data for itinerary ID ${itinerary.id}:`, error);
                return null;
            }
            console.log('Complete data fetched for itinerary:', completeData);

            return completeData;
        }));

        if (error) throw error;
        return itinerariesCompleteData;
    } catch (error) {
        console.error('Error fetching featured itineraries:', error);
        throw error;
    }
}

export { getAllFeaturedItineraries };