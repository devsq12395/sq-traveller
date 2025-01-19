<template>
  <div class="featured-itinerary" @click="goToItinerary">
    <img :src="itinerary.image" alt="Itinerary Image" class="itinerary-image" />
    <div class="itinerary-details">
      <h2>{{ itinerary.name }}</h2>
      <p>{{ itinerary.description }}</p>
      <ul>
        <li><strong>Days:</strong> {{ itinerary.days }}</li>
        <li><strong>Budget:</strong> {{ itinerary.budget }}</li>
        <li><strong>Created by:</strong> {{ itinerary.createdBy }}</li>
        <li><strong>Ratings:</strong> {{ itinerary.ratings }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itinerary: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped>
.featured-itinerary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.itinerary-image {
  width: 40%;
  height: auto;
  border-radius: 8px;
  margin-right: 20px;
}
.itinerary-details {
  width: 60%;
}
ul {
  list-style-type: none;
  padding: 0;
}
</style>