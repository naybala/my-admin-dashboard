<script setup lang="ts">
import { ref, watch } from "vue";
import { useProductTable } from "@composables/products/useProductTable";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { usePermissionStore } from "@stores/permission";
import { computed } from "vue";

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

const {
  t,
  filteredProducts,
  loading,
  error,
  searchTerm,
  openNewProductForm,
  editProduct,
  confirmDeleteProduct,
} = useProductTable();

const rowsPerPage = ref(10);
const currentPage = ref(1);

watch([currentPage, rowsPerPage], async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 100));
  loading.value = false;
});

const onPageChange = (event: any) => {
  currentPage.value = event.page + 1;
};

const onRowsChange = (newRows: number) => {
  rowsPerPage.value = newRows;
  currentPage.value = 1;
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("products.title") }}</h1>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-6 flex-wrap">
        <InputText
          v-model="searchTerm"
          :placeholder="t('common.search')"
          class="p-inputtext-sm w-full md:w-1/3 dark:bg-gray-700 dark:text-white md:mb-0 mb-3"
        />
        <Button
          v-if="createProductPermission"
          :label="t('products.add')"
          icon="pi pi-plus"
          class="p-button-success"
          @click="openNewProductForm"
        />
      </div>

      <div v-if="loading" class="text-center text-gray-500">
        {{ t("common.loading") }}...
      </div>
      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <DataTable
          :value="filteredProducts"
          stripedRows
          :paginator="true"
          :rows="rowsPerPage"
          :first="(currentPage - 1) * rowsPerPage"
          :rowsPerPageOptions="[10, 20, 50, 1000]"
          class="p-datatable-sm dark:text-gray-100"
          @page="onPageChange"
          @update:rows="onRowsChange"
        >
          <Column field="name" :header="t('products.name')" />
          <Column field="categoryId" :header="t('products.category')">
            <template #body="slotProps">
              {{ slotProps.data.category }}
            </template>
          </Column>
          <Column field="description" :header="t('products.description')" />
          <Column
            :header="t('products.actions')"
            :exportable="false"
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              <Button
                v-if="editProductPermission"
                icon="pi pi-pencil"
                severity="warning"
                text
                rounded
                class="mr-2"
                @click="editProduct(slotProps.data)"
              />
              <Button
                v-if="deleteProductPermission"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="confirmDeleteProduct($event, slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
