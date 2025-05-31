// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import ProductListView from '../views/products/ProductListView.vue';
import ProductFormView from '../views/products/ProductFormView.vue';


const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/products',
    name: 'products',
    component: ProductListView,
  },
  {
    path: '/products/new',
    name: 'product-new',
    component: ProductFormView,
  },
  {
    path: '/products/edit/:id',
    name: 'product-edit',
    component: ProductFormView,
    props: true, // Pass route params as props to the component
  },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router