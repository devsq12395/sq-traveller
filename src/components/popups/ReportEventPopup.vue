
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div class="bg-gray-100 p-6 rounded shadow-lg w-full md:w-[600px]" style="max-height: 80vh; margin-top: 10vh;">
      <h2 class="text-2xl font-bold mb-4">Report an Event</h2>
      <div class="border-b border-gray-200 mb-6"></div>
      <div class="overflow-auto" style="max-height: calc(100vh - 300px);">
        <form @submit.prevent="handleReportEvent" class="space-y-6">
          <!-- Report Details -->
          <div class="flex flex-col gap-4">
            <!-- Description Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="description" class="text-gray-700 font-semibold text-left">
                Report Details:
              </label>
              <textarea
                id="description"
                v-model="report.description"
                placeholder="Provide additional details"
                rows="4"
                class="col-span-2 p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
          </div>
          <div class="actions mt-4 flex justify-between space-x-2">
            <button type="button" @click="closePopup" @click.stop class="p-2 bg-gray-300 rounded flex-1">Cancel</button>
            <button type="submit" class="p-2 bg-red-500 text-white rounded flex-1">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { addReport } from '../../helpers/itineraryReports';
import { useUser } from '../../context/UserContext';

export default {
  name: 'ReportEventPopup',
  props: {
    itineraryId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const report = ref({
      description: '',
    });
    const user = useUser();

    const handleReportEvent = async () => {
      if (!user.username) {
        alert('You must be logged in to report an event.');
        return;
      }

      const { error } = await addReport(props.itineraryId, user.user_id, report.value.description);

      if (error) {
        console.error('Error submitting report:', error);
        alert('There was an error submitting your report. Please try again.');
      } else {
        alert('Report is submitted. We will look into this.');
        closePopup();
      }
    };

    const closePopup = () => {
      emit('close');
    };

    return {
      report,
      handleReportEvent,
      closePopup,
      user
    };
  },
};
</script>

<style scoped>
.report-event-popup {
  /* Add any specific styles for the report event popup here */
}
</style>