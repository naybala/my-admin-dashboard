import RoleListView from "@views/roles/RoleListView.vue";
import RoleFormView from "@views/roles/RoleFormView.vue";

export const roleRoutes = [
  {
    path: "/roles",
    name: "roles",
    component: RoleListView,
    meta: { 
      requiresAuth: true , 
      permission: 'manage roles',
      sidebar: true,                    
      label: "sidebar.roles",        
      icon: "pi pi-box",                 
    },
  },
  {
    path: "/roles/new",
    name: "role-new",
    component: RoleFormView,
    meta: { 
      requiresAuth: true, 
      permission: 'create roles' 
    },
  },
  {
    path: "/roles/edit/:id",
    name: "role-edit",
    component: RoleFormView,
    props: true,
    meta: { 
      requiresAuth: true, 
      permission: 'edit roles' 
    },
  },
];
