import CategoryListView from "../views/categories/CategoryListView.vue";
import CategoryFormView from "../views/categories/CategoryFormView.vue";

export const categoryRoutes = [
  {
    path: "/categories",
    name: "categories",
    component: CategoryListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories/new",
    name: "category-new",
    component: CategoryFormView,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories/edit/:id",
    name: "category-edit",
    component: CategoryFormView,
    props: true,
    meta: { requiresAuth: true },
  },
];
