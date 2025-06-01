import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import ProductListView from '../views/products/ProductListView.vue';
import ProductFormView from '../views/products/ProductFormView.vue';

import CategoryListView from '../views/categories/CategoryListView.vue';
import CategoryFormView from '../views/categories/CategoryFormView.vue';


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
    props: true, 
  },
   {
    path: '/categories',
    name: 'categories',
    component: CategoryListView,
  },
  {
    path: '/categories/new',
    name: 'category-new',
    component: CategoryFormView,
  },
  {
    path: '/categories/edit/:id',
    name: 'category-edit',
    component: CategoryFormView,
    props: true, 
  },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router