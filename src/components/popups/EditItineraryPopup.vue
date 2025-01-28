<template>
  <div :class="{'fixed inset-0 flex justify-center bg-gray-900 bg-opacity-50 z-50': true, 'items-center': isDesktop, 'overflow-y-auto items-stretch h-screen min-h-screen': !isDesktop}">
    <div :class="{'bg-white p-6 rounded shadow-lg w-[900px]': true, 'h-screen min-h-screen overflow-y-auto': !isDesktop}">
      <h2 class="text-2xl font-bold mb-4">Edit Itinerary</h2>

      <div class="border-b border-gray-400 mb-6"></div>

      <form @submit.prevent="handleEditItinerary" class="space-y-6">
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <div :class="{'flex gap-6 relative': isDesktop, 'block overflow-y-auto': !isDesktop}">
          <!-- Left Side: Itinerary Details -->
          <div class="w-full md:w-1/2 flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Itinerary Details</h3>

            <!-- Itinerary Name Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="name" class="text-gray-700 font-semibold text-left">Itinerary Name: <span class="text-gray-500">({{ itinerary.name.length }}/80)</span></label>
              <input
                type="text"
                id="name"
                v-model="itinerary.name"
                placeholder="Itinerary Name"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
                maxlength="80"
              />
            </div>

            <!-- Itinerary Description Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="description" class="text-gray-700 font-semibold text-left">Short Description: <span class="text-gray-500">({{ itinerary.description.length }}/200)</span></label>
              <textarea
                id="description"
                v-model="itinerary.description"
                placeholder="Itinerary Description"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
                maxlength="200"
              ></textarea>
            </div>

            <!-- Number of Days Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="days" class="text-gray-700 font-semibold text-left">Number of Days:<span class="text-gray-500"> (Up to 15 days)</span></label>
              <input
                type="number"
                id="days"
                v-model="itinerary.days"
                placeholder="Number of days"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <!-- Right Side: Location and Image -->
          <div class="w-full md:w-1/2">
            <h3 class="text-lg font-semibold">Thumbnail Image</h3>
            <div class="flex border-b border-gray-200 bg-blue-50">
                <button
                  type="button"
                  @click="activeTab = 'auto'"
                  class="px-4 py-2 text-sm font-medium"
                  :class="[
                    activeTab === 'auto'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-blue-100'
                  ]"
                >
                  AutoSearch
                </button>
                <button
                  type="button"
                  @click="activeTab = 'manual'"
                  class="px-4 py-2 text-sm font-medium"
                  :class="[
                    activeTab === 'manual'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-blue-100'
                  ]"
                >
                  Manual Input
                </button>
              </div>
              <div v-if="activeTab === 'auto'">
                <CreateEventAutoSearch 
                  :setLocation="setLocation"
                  :setImageURL="setImageURL"
                />
              </div>
              <div v-if="activeTab === 'manual'">
                <CreateEventManualInput
                  :setLocation="setLocation"
                  :setImageURL="setImageURL"
                  :hasLocation="false"
                />
              </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { editItinerary, fetchItinerary, updateItineraryImage } from '../../helpers/itinerary';
import CreateEventAutoSearch from './CreateEventAutoSearch.vue';
import CreateEventManualInput from './CreateEventManualInput.vue';
import { useUser } from '../../context/UserContext';

export default {
  name: 'EditItineraryPopup',
  emits: ['close', 'refresh'],
  components: {
    CreateEventAutoSearch,
    CreateEventManualInput
  },
  props: {
    itineraryId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const itinerary = ref({
      name: '',
      description: '',
      days: 0,
    });

    const errorMessage = ref('');
    const isDesktop = ref(window.innerWidth >= 768);
    const activeTab = ref('auto');
    const location = ref('');
    const imageUrl = ref('');
    const userData = useUser();

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };
    onMounted(async () => {
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize();

      const { data, error } = await fetchItinerary(props.itineraryId, userData.user_id);
      if (!error && data) {
        itinerary.value = {
          name: data.name || '',
          description: data.description || '',
          days: data.days || 0,
        };
      } else {
        itinerary.value = data;
      }
    });

    const handleEditItinerary = async () => {
      if (itinerary.value.name && itinerary.value.description && itinerary.value.days > 0) {
        const { error } = await editItinerary(props.itineraryId, {...itinerary.value});
        if (error) {
          errorMessage.value = 'Failed to edit itinerary. Please try again.';
          return;
        }

        if (imageUrl.value) {
          try {
            await updateItineraryImage(props.itineraryId, imageUrl.value);
          } catch (imgError) {
            console.error('Error saving itinerary image:', imgError);
          }
        }

        emit('refresh');
        emit('close');
      } else {
        errorMessage.value = 'Please fill out all fields correctly.';
      }
    };

    const setLocation = (loc) => {
      location.value = loc;
    };

    const setImageURL = (url) => {
      imageUrl.value = url;
    };

    return {
      itinerary,
      errorMessage,
      isDesktop,
      handleEditItinerary,
      activeTab,
      location,
      imageUrl,
      setLocation,
      setImageURL,
      checkWindowSize
    };
  },
};
</script>