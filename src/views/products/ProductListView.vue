<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../../composables/useCrud";
import type { Product, Category } from "../../types";

// PrimeVue Components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();

const {
  items: products,
  filteredItems: filteredProducts,
  loading,
  error,
  searchTerm,
  fetchAll,
  deleteItem,
} = useCrud<Product>({ apiPath: "products" });

const { items: categories, fetchAll: fetchCategories } = useCrud<Category>({
  apiPath: "categories",
});

onMounted(async () => {
  await fetchAll();
  await fetchCategories();
});

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : "Unknown";
};

const openNewProductForm = () => {
  router.push({ name: "product-new" });
};

const editProduct = (product: Product) => {
  router.push({ name: "product-edit", params: { id: product.id } });
};

const confirmDeleteProduct = (event: Event, product: Product) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: t("products.confirmDelete"),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      if (product.id) {
        await deleteItem(product.id);
        toast.add({
          severity: "success",
          summary: t("common.success"),
          detail: t("products.productDeleted"),
          life: 3000,
        });
      }
    },
    reject: () => {
      toast.add({
        severity: "info",
        summary: t("common.cancelled"),
        detail: t("common.deleteCancelled"),
        life: 3000,
      });
    },
  });
};
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
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <DataTable
          :value="filteredProducts"
          stripedRows
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          class="p-datatable-sm dark:text-gray-100"
        >
          <Column field="name" :header="t('products.name')"></Column>
          <Column field="price" :header="t('products.price')">
            <template #body="slotProps">
              ${{ slotProps.data.price.toFixed(2) }}
            </template>
          </Column>
          <Column field="categoryId" :header="t('products.category')">
            <template #body="slotProps">
              {{ getCategoryName(slotProps.data.categoryId) }}
            </template>
          </Column>
          <Column
            field="description"
            :header="t('products.description')"
          ></Column>
          <Column
            :header="t('products.actions')"
            :exportable="false"
            style="min-width: 8rem"
          >
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
