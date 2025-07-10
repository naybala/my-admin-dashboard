<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { useProductTable } from "@composables/products/useProductTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";

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
const { t } = useI18n();

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
  <div class="p-0 md:p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("products.products") }}</h1>
    <!-- Loading/Error -->
    <div v-if="loading" class="text-center text-gray-500">
      <Loader />
    </div>

    <div v-else>
      <!-- Search and Add -->
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md"
        />
        <Button
          v-if="createProductPermission"
          label="Add Product"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 p-2 shadow-md"
          @click="openNewProductForm"
        />
      </div>

      <!-- Table & Paginator -->
      <div>
        <div v-if="products.length === 0" class="text-gray-300">
          No Data Found...
        </div>
        <div v-else class="shadow-md">
          <BaseTable
            :columns="tableColumns"
            :items="products"
            :actions="tableActions"
          />
          <div
            class="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4 pb-2"
          >
            <Paginator
              :rows="limit"
              :first="first"
              :totalRecords="total"
              :page="page - 1"
              :rowsPerPageOptions="[10, 20, 50]"
              @page="onPageChange"
              class="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
