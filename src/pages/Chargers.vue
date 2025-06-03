<template>
  <div>
    <!-- Top Navbar -->
    <nav class="navbar">
      <h2>
        <span class="icon">⚡</span> Charging Stations
      </h2>
      <div class="user-section" v-if="isAuthenticated">
        <span class="welcome-message">Welcome, {{ userName || 'User' }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </nav>

    <!-- Filters & Form -->
    <div class="controls">
      <button @click="toggleForm" class="add-btn">
        {{ showForm ? 'Cancel' : '+ Add Charger' }}
      </button>
      <ChargerForm 
        v-if="showForm" 
        @refresh="fetchChargers" 
        @cancel="showForm = false" 
      />

      <div class="filter-group">
        <label><strong>Status:</strong></label>
        <select v-model="filters.status" @change="fetchChargers">
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="offline">Offline</option>
        </select>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Left: Chargers List -->
      <div class="list-container">
        <div v-for="station in chargers" :key="station._id" class="station-card">
          <h3>{{ station.name }}</h3>
          <p>Location: {{ station.location }}</p>
          <p>
            Status:
            <span :style="{ color: statusColor(station.status), fontWeight: 'bold' }">
              {{ station.status }}
            </span>
          </p>
          <button @click="deleteCharger(station._id)" class="delete-btn">Delete</button>
        </div>
      </div>

      <!-- Right: Map View -->
      <div class="map-container">
        <MapView :chargers="chargers" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";
import ChargerForm from "../components/ChargerForm.vue";
import MapView from "../components/MapView.vue";

export default {
  components: { ChargerForm, MapView },
  data() {
    return {
      chargers: [],
      filters: { status: "" },
      showForm: false,
      userName: null,
    };
  },
  computed: {
    isAuthenticated() {
      return !!getToken() || !!this.userName;
    }
  },
  mounted() {
    this.loadUser();
    this.fetchChargers();
  },
  methods: {
    statusColor(status) {
      const colors = {
        available: '#4CAF50',
        occupied: '#FF9800',
        offline: '#F44336'
      };
      return colors[status] || '#000';
    },
    loadUser() {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.userName = user.name || user.username || user.email || null;
          console.log("Loaded user:", this.userName); // Debug log
        } catch (error) {
          console.error("Error parsing user data:", error);
          this.userName = null;
        }
      } else {
        console.log("No user data found in localStorage"); // Debug log
      }
    },
    async fetchChargers() {
      try {
        const res = await axios.get("http://localhost:5000/api/stations", {
          headers: { Authorization: `Bearer ${getToken()}` },
          params: this.filters,
        });
        this.chargers = res.data;
      } catch (err) {
        console.error("Error fetching chargers:", err);
        alert("Error fetching chargers");
      }
    },
    async deleteCharger(id) {
      if (!confirm("Are you sure you want to delete this charger?")) return;
      try {
        await axios.delete(`http://localhost:5000/api/stations/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        this.fetchChargers();
      } catch (err) {
        console.error("Error deleting charger:", err);
        alert("Error deleting charger");
      }
    },
    logout() {
      // Clear all authentication data
      removeToken();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.clear();
      
      // Redirect to login page
      this.$router.push("").catch(() => {});
      
      // Optional: Force reload to clear all state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
  },
};
</script>

<style scoped>
/* Navbar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-message {
  font-weight: 500;
  color: #333;
}

.icon {
  margin-right: 8px;
}

.logout-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c0392b;
}

/* Controls Section */
.controls {
  padding: 0 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-btn {
  padding: 8px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #3e8e41;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* Main Content */
.main-container {
  display: flex;
  gap: 20px;
  padding: 0 24px 24px;
  height: calc(100vh - 180px);
}

.list-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.station-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.station-card:hover {
  transform: translateY(-2px);
}

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #d32f2f;
}

.map-container {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>