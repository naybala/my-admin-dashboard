import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    dashboardTitle: 'Admin Dashboard',
    sidebar: {
      dashboard: 'Dashboard',
      products: 'Products',
      categories: 'Categories',
      settings: 'Settings',
    },
    products: {
      title: 'Products Management',
      list: 'Product List',
      add: 'Add Product',
      edit: 'Edit Product',
      delete: 'Delete Product',
      name: 'Name',
      price: 'Price',
      category: 'Category',
      description: 'Description',
      actions: 'Actions',
      confirmDelete: 'Are you sure you want to delete this product?',
      productCreated: 'Product created successfully!',
      productUpdated: 'Product updated successfully!',
      productDeleted: 'Product deleted successfully!',
    },
    categories: {
      title: 'Categories Management',
      list: 'Category List',
      add: 'Add Category',
      edit: 'Edit Category',
      delete: 'Delete Category',
      name: 'Name',
      description: 'Description',
      actions: 'Actions',
      confirmDelete: 'Are you sure you want to delete this category?',
      categoryCreated: 'Category created successfully!',
      categoryUpdated: 'Category updated successfully!',
      categoryDeleted: 'Category deleted successfully!',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      new: 'New',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search...',
    }
  },
  es: {
    dashboardTitle: 'Panel de Administración',
    sidebar: {
      dashboard: 'Tablero',
      products: 'Productos',
      categories: 'Categorías',
      settings: 'Configuración',
    },
    products: {
      title: 'Gestión de Productos',
      list: 'Lista de Productos',
      add: 'Añadir Producto',
      edit: 'Editar Producto',
      delete: 'Eliminar Producto',
      name: 'Nombre',
      price: 'Precio',
      category: 'Categoría',
      description: 'Descripción',
      actions: 'Acciones',
      confirmDelete: '¿Estás seguro de que quieres eliminar este producto?',
      productCreated: '¡Producto creado exitosamente!',
      productUpdated: '¡Producto actualizado exitosamente!',
      productDeleted: '¡Producto eliminado exitosamente!',
    },
    categories: {
      title: 'Gestión de Categorías',
      list: 'Lista de Categorías',
      add: 'Añadir Categoría',
      edit: 'Editar Categoría',
      delete: 'Eliminar Categoría',
      name: 'Nombre',
      description: 'Descripción',
      actions: 'Acciones',
      confirmDelete: '¿Estás seguro de que quieres eliminar esta categoría?',
      categoryCreated: '¡Categoría creada exitosamente!',
      categoryUpdated: '¡Categoría actualizada exitosamente!',
      categoryDeleted: '¡Categoría eliminada exitosamente!',
    },
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      new: 'Nuevo',
      edit: 'Editar',
      delete: 'Eliminar',
      search: 'Buscar...',
    }
  }
}

const i18n = createI18n({
  legacy: false, 
  locale: 'en', 
  fallbackLocale: 'en',
  messages,
})

export default i18n