<template>
  <div class="charger-item">
    <h4>{{ charger.name }}</h4>
    <p>Status: {{ charger.status }}</p>
    <button @click="deleteCharger">Delete</button>
  </div>
</template>

<script>
import axios from 'axios';
import { getToken } from '../utils/auth';

export default {
  props: ['charger'],
  methods: {
    async deleteCharger() {
      await axios.delete(`http://localhost:5000/api/stations/${this.charger._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      this.$emit('refresh');
    },
  },
};
</script>
