<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form-container">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div class="form-group">
        <label>Station Name:</label>
        <input 
          v-model="name" 
          placeholder="Enter station name" 
          required
          :disabled="isLoading"
        >
      </div>
      
      <div class="form-group">
        <label>Location:</label>
        <input 
          v-model="location" 
          placeholder="Enter location" 
          required
          :disabled="isLoading"
        >
      </div>
      
      <div class="form-group">
        <label>Status:</label>
        <select 
          v-model="status" 
          required
          :disabled="isLoading"
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      
      <div class="form-actions">
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Add Charger</span>
          <span v-else>Adding...</span>
        </button>
        <button 
          type="button" 
          @click="cancelForm" 
          class="cancel-btn"
          :disabled="isLoading"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "../utils/auth";

export default {
  data() {
    return {
      name: "",
      location: "",
      status: "available",
      isLoading: false,
      error: null
    };
  },
  methods: {
    async handleSubmit() {
      console.log("Form submission started");
      this.isLoading = true;
      this.error = null;
      
      try {
        console.log("Submitting data:", {
          name: this.name,
          location: this.location,
          status: this.status
        });

        const token = getToken();
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.post(
          "http://localhost:5000/api/stations",
          {
            name: this.name,
            location: this.location,
            status: this.status
          },
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Station added:", response.data);
        this.$emit("refresh");
        this.resetForm();
        this.$emit("success", "Charger added successfully!");
      } catch (err) {
        console.error("Error adding charger:", err);
        
        if (err.response) {
          this.error = err.response.data?.message || 
                     `Server error: ${err.response.status}`;
        } else if (err.request) {
          this.error = "Network error - no response from server";
        } else {
          this.error = err.message || "Failed to add charger";
        }
        
        this.$emit("error", this.error);
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.name = "";
      this.location = "";
      this.status = "available";
    },
    cancelForm() {
      this.resetForm();
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped>
.form-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.submit-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #3e8e41;
}

.submit-btn:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background: #d32f2f;
}

.cancel-btn:disabled {
  background: #ef9a9a;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 0.9em;
}
</style>