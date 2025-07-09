<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { useProductTable } from "@composables/products/useProductTable";
import { usePermissionStore } from "@/stores/permission";
import TableLoader from "@/components/common/TableLoader.vue";

const {
  products,
  loading,
  error,
  searchTerm,
  page,
  limit,
  total,
  fetchData,
  openNewProductForm,
  editProduct,
  confirmDeleteProduct,
} = useProductTable();

const first = computed(() => (page.value - 1) * limit.value);
const onPageChange = (event: any) => fetchData(event.page + 1, event.rows);

watch(searchTerm, () => fetchData(1));
onMounted(() => {
  fetchData();
  console.log(loading.value);
});

const permissionStore = usePermissionStore();
const createProductPermission = computed(() =>
  permissionStore.hasPermission("create products")
);
const editProductPermission = computed(() =>
  permissionStore.hasPermission("edit products")
);
const deleteProductPermission = computed(() =>
  permissionStore.hasPermission("delete products")
);

// Table columns and actions
const tableColumns = [
  { label: "Name", field: "name" },
  { label: "Category", field: "category" },
  { label: "Description", field: "description" },
];

const tableActions = [
  {
    icon: "pi pi-pencil",
    permission: editProductPermission.value,
    handler: (item: any) => editProduct(item),
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-trash",
    permission: deleteProductPermission.value,
    handler: (item: any, event: Event) => confirmDeleteProduct(event, item),
    class: "p-button-text p-button-danger",
  },
];

watch(loading, (val) => {
  console.log("Loading changed:", val);
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Products</h1>
    <!-- Loading/Error -->
    <div v-if="loading" class="text-center text-gray-500">
      <TableLoader />
    </div>

    <div v-else>
      <!-- Search and Add -->
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3"
        />
        <Button
          v-if="createProductPermission"
          label="Add Product"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 p-2"
          @click="openNewProductForm"
        />
      </div>

      <!-- Table & Paginator -->
      <div>
        <span v-if="products.length === 0" class="text-gray-300">
          No Data Found...
        </span>
        <span v-else>
          <BaseTable
            :columns="tableColumns"
            :items="products"
            :actions="tableActions"
          />
          <div class="mt-4">
            <Paginator
              :rows="limit"
              :first="first"
              :totalRecords="total"
              :page="page - 1"
              :rowsPerPageOptions="[10, 20, 50]"
              @page="onPageChange"
            />
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
