import ProductListView from "@views/products/ProductListView.vue";
import ProductFormView from "@views/products/ProductFormView.vue";

export const productRoutes = [
  {
    path: "/products",
    name: "products",
    component: ProductListView,
    meta: { 
      requiresAuth: true , 
      permission: 'manage products'
    },
  },
  {
    path: "/products/new",
    name: "product-new",
    component: ProductFormView,
    meta: { 
      requiresAuth: true, 
      permission: 'create products' 
    },
  },
  {
    path: "/products/edit/:id",
    name: "product-edit",
    component: ProductFormView,
    props: true,
    meta: { 
      requiresAuth: true, 
      permission: 'edit products' 
    },
  },
];
