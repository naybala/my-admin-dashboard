<script setup lang="ts">
import { useProductTable } from "../../composables/products/useProductTable";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

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
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("products.title") }}</h1>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <InputText
          v-model="searchTerm"
          :placeholder="t('common.search')"
          class="p-inputtext-sm w-full md:w-1/3 dark:bg-gray-700 dark:text-white"
        />
        <Button
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
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          class="p-datatable-sm dark:text-gray-100"
        >
          <!-- Headers -->
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
            <!-- Headers -->

            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                severity="warning"
                text
                rounded
                class="mr-2"
                @click="editProduct(slotProps.data)"
              />
              <Button
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

<style scoped>
:deep(.p-datatable) {
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
}
.dark :deep(.p-datatable .p-datatable-thead th) {
  background-color: var(--surface-800);
  color: var(--surface-0);
}
.dark :deep(.p-datatable .p-datatable-tbody tr) {
  background-color: var(--surface-900);
  color: var(--surface-100);
}
.dark :deep(.p-inputtext) {
  background-color: var(--surface-700);
  color: var(--surface-0);
  border-color: var(--surface-600);
}
.dark :deep(.p-inputtext:hover) {
  border-color: var(--primary-color);
}
</style>
