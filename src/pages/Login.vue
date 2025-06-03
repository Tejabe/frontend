<template>
  <div class="auth-container">
    <!-- Login Section -->
    <div class="auth-box login-box">
      <h2>Welcome Back</h2>
      <p>Please enter your credentials to log in.</p>
      
      <input v-model="email" placeholder="Email" class="input-field" />
      <input v-model="password" type="password" placeholder="Password" class="input-field" />

      <button @click="login" class="auth-btn">Login</button>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    </div>

    <!-- Register Section -->
    <div class="auth-box register-box">
      <h2>Create an Account</h2>
      <p>Fill in the details to register.</p>


      <input v-model="registerName" placeholder="Name" class="input-field" />
      <input v-model="registerEmail" placeholder="Email" class="input-field" />
      <input v-model="registerPassword" type="password" placeholder="Password" class="input-field" />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="input-field" />

      <button @click="register" class="auth-btn">Register</button>

      <p v-if="registerError" class="error-text">{{ registerError }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { saveToken } from "../utils/auth";

export default {
  data() {
  return {
    email: "",
    password: "",
    errorMessage: "",
    registerName: "",  // ✅ add this
    registerEmail: "",
    registerPassword: "",
    confirmPassword: "", // ✅ add this
    registerError: "",
  };
},
  methods: {
    async login() {
    try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: this.email.trim().toLowerCase(), // ✅ normalize email
        password: this.password,
        });
        saveToken(res.data.token);
        this.$router.push("/chargers");
    } catch (err) {
        this.errorMessage = "Invalid login credentials. Please try again.";
    }
    },
    
    async register() {
      if (this.registerPassword !== this.confirmPassword) {
        this.registerError = "Passwords do not match.";
        return;
      }

      try {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name: this.registerName,
          email: this.registerEmail,
          password: this.registerPassword,
        });
        saveToken(res.data.token);
        this.$router.push("/chargers");
      } catch (err) {
        this.registerError = "Registration failed. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.auth-box {
  width: 50%;
  padding: 20px;
  background: white;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.input-field {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.auth-btn {
  width: 80%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.auth-btn:hover {
  background-color: #45a049;
}

.error-text {
  color: red;
  margin-top: 10px;
}

.login-box {
  border-right: 2px solid #ccc;
}

.register-box {
  border-left: 2px solid #ccc;
}
</style>