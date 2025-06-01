<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../../composables/useCrud";
import type { Category } from "../../types";

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
  items: categories,
  filteredItems: filteredCategories,
  loading,
  error,
  searchTerm,
  fetchAll,
  deleteItem,
} = useCrud<Category>({ apiPath: "categories" });

const deleteCategoryDialog = ref(false);
const categoryToDelete = ref<Category | null>(null);

onMounted(async () => {
  await fetchAll();
});

const openNewCategoryForm = () => {
  router.push({ name: "category-new" });
};

const editCategory = (category: Category) => {
  router.push({ name: "category-edit", params: { id: category.id } });
};

const confirmDeleteCategory = (event: Event, category: Category) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: t("categories.confirmDelete"),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      if (category.id) {
        await deleteItem(category.id);
        toast.add({
          severity: "success",
          summary: t("common.success"),
          detail: t("categories.categoryDeleted"),
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
    <h1 class="text-3xl font-bold mb-6">{{ t("categories.title") }}</h1>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <InputText
          v-model="searchTerm"
          :placeholder="t('common.search')"
          class="p-inputtext-sm w-full md:w-1/3 dark:bg-gray-700 dark:text-white"
        />
        <Button
          :label="t('categories.add')"
          icon="pi pi-plus"
          class="p-button-success"
          @click="openNewCategoryForm"
        />
      </div>

      <div v-if="loading" class="text-center text-gray-500">
        {{ t("common.loading") }}...
      </div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <DataTable
          :value="filteredCategories"
          stripedRows
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          class="p-datatable-sm dark:text-gray-100"
        >
          <Column field="name" :header="t('categories.name')"></Column>

          <Column
            field="description"
            :header="t('categories.description')"
          ></Column>
          <Column
            :header="t('categories.actions')"
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
                @click="editCategory(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="confirmDeleteCategory($event, slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
