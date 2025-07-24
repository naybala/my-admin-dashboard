import UserListView from "@views/users/UserListView.vue";
import UserFormView from "@views/users/UserFormView.vue";

export const userRoutes = [
  {
    path: "/users",
    name: "users",
    component: UserListView,
    meta: { 
      requiresAuth: true , 
      permission: 'manage users',
      sidebar: true,                    
      label: "sidebar.users",        
      icon: "pi pi-box",                 
    },
  },
  {
    path: "/users/new",
    name: "user-new",
    component: UserFormView,
    meta: { 
      requiresAuth: true, 
      permission: 'create users' 
    },
  },
  {
    path: "/users/edit/:id",
    name: "user-edit",
    component: UserFormView,
    props: true,
    meta: { 
      requiresAuth: true, 
      permission: 'edit users' 
    },
  },
];
