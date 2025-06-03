import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Chargers from '../pages/Chargers.vue';
import { getToken } from '../utils/auth'; // Import JWT token retrieval function

const routes = [
  { path: '/', component: Login },
  { path: '/chargers', component: Chargers, meta: { requiresAuth: true } } // Protect Chargers route
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Add navigation guard to enforce authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !getToken()) {
    next('/'); // Redirect to login if no token is found
  } else {
    next();
  }
});

export default router;