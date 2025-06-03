import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { getToken } from './utils/auth'; // Import token functions
import 'leaflet/dist/leaflet.css';


const app = createApp(App);

// Automatically attach JWT token to requests
axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

app.use(router);
app.mount('#app');