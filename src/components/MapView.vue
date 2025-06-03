<template>
  <div class="map-container">
    <!-- Charger Filters -->
    <div class="filters">
      <div class="filter-group">
        <label><strong>Status:</strong></label>
        <label><input type="radio" v-model="selectedStatus" value="" @change="filterChargers"> All</label>
        <label><input type="radio" v-model="selectedStatus" value="Active" @change="filterChargers"> Active</label>
        <label><input type="radio" v-model="selectedStatus" value="Inactive" @change="filterChargers"> Inactive</label>
      </div>

      <div class="filter-group">
        <label><strong>Power Output:</strong></label>
        <label><input type="radio" v-model="selectedPower" value="" @change="filterChargers"> All</label>
        <label><input type="radio" v-model="selectedPower" value="50" @change="filterChargers"> 50 kW</label>
        <label><input type="radio" v-model="selectedPower" value="100" @change="filterChargers"> 100 kW</label>
      </div>
    </div>

    <!-- Map Display -->
    <div id="map" style="height: 500px;"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  props: ["chargers"],
  data() {
    return {
      map: null,
      markers: [],
      selectedStatus: "",
      selectedPower: "",
    };
  },
  watch: {
    chargers: {
      handler(newVal) {
        this.updateMarkers(newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.map = L.map("map").setView([20.5937, 78.9629], 5); // India Center
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);
  },
  methods: {
    updateMarkers(chargers) {
      // Clear existing markers
      this.markers.forEach((marker) => this.map.removeLayer(marker));
      this.markers = [];

      chargers.forEach((station) => {
        if (station.location?.latitude && station.location?.longitude) {
          // Choose marker icon based on status
          const icon = L.icon({
            iconUrl: station.status === "Active" ? "path/to/green-marker.png" : "path/to/red-marker.png",
            iconSize: [25, 41],
          });

          const marker = L.marker(
            [station.location.latitude, station.location.longitude], 
            { icon }
          )
            .addTo(this.map)
            .bindPopup(`<b>${station.name}</b><br>Status: ${station.status}<br>Power Output: ${station.power} kW`);

          this.markers.push(marker);
        }
      });
    },
    filterChargers() {
      const filtered = this.chargers.filter(station => {
        return (!this.selectedStatus || station.status === this.selectedStatus) &&
               (!this.selectedPower || station.power.toString() === this.selectedPower);
      });
      this.updateMarkers(filtered);
    },
  },
};
</script>

<style scoped>
.map-container {
  text-align: center;
}

.filters {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

input[type="radio"] {
  margin-right: 5px;
}
</style>