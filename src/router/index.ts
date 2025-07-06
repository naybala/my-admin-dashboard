import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Import all route modules
import { authRoutes } from "./authRoutes";
import { dashboardRoute } from "./dashboardRoute";
import { productRoutes } from "./productRoutes";
import { categoryRoutes } from "./categoryRoutes";

// Combine all routes
const routes = [
  ...authRoutes,
  ...dashboardRoute,
  ...productRoutes,
  ...categoryRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (to.meta.requiresAuth && !token) {
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
