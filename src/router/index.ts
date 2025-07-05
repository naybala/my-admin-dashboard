import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import { useAuthStore } from '../stores/auth';

import DashboardView from '../views/DashboardView.vue';
import ProductListView from '../views/products/ProductListView.vue';
import Login from '../views/auth/Login.vue';
import ProductFormView from '../views/products/ProductFormView.vue';
import CategoryListView from '../views/categories/CategoryListView.vue';
import CategoryFormView from '../views/categories/CategoryFormView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/products',
    name: 'products',
    component: ProductListView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/products/new',
    name: 'product-new',
    component: ProductFormView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/products/edit/:id',
    name: 'product-edit',
    component: ProductFormView,
    props: true,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoryListView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/categories/new',
    name: 'category-new',
    component: CategoryFormView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/categories/edit/:id',
    name: 'category-edit',
    component: CategoryFormView,
    props: true,
    meta: { requiresAuth: true }, 
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // Check for token from Pinia or Cookies
  const token = authStore.token || Cookies.get('auth-token');
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
