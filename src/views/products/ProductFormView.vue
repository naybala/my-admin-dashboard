<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../../composables/useCrud";
import type { Product, Category } from "../../types";

// PrimeVue Components
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();

const productId = route.params.id ? Number(route.params.id) : null;

const {
  selectedItem: product,
  loading,
  error,
  fetchOne,
  createItem,
  updateItem,
} = useCrud<Product>({ apiPath: "products" });

const { items: categories, fetchAll: fetchCategories } = useCrud<Category>({
  apiPath: "categories",
});

const isEditMode = ref(false);

const productForm = ref<Product>({
  name: "",
  price: 0,
  categoryId: 0,
  description: "",
});

onMounted(async () => {
  await fetchCategories();
  if (productId) {
    isEditMode.value = true;
    await fetchOne(productId);
    if (product.value) {
      // Deep copy to avoid direct modification of the reactive `selectedItem`
      productForm.value = JSON.parse(JSON.stringify(product.value));
    }
  }
});

watch(product, (newVal) => {
  if (newVal) {
    productForm.value = JSON.parse(JSON.stringify(newVal));
  }
});

const saveProduct = async () => {
  if (isEditMode.value && productId) {
    await updateItem(productId, productForm.value);
    if (!error.value) {
      toast.add({
        severity: "success",
        summary: t("common.success"),
        detail: t("products.productUpdated"),
        life: 3000,
      });
      router.push({ name: "products" });
    } else {
      toast.add({
        severity: "error",
        summary: t("common.error"),
        detail: error.value,
        life: 3000,
      });
    }
  } else {
    await createItem(productForm.value);
    if (!error.value) {
      toast.add({
        severity: "success",
        summary: t("common.success"),
        detail: t("products.productCreated"),
        life: 3000,
      });
      router.push({ name: "products" });
    } else {
      toast.add({
        severity: "error",
        summary: t("common.error"),
        detail: error.value,
        life: 3000,
      });
    }
  }
};

const cancel = () => {
  router.push({ name: "products" });
};
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{ isEditMode ? t("products.edit") : t("products.add") }}
      {{ t("products.title") }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <div v-if="loading" class="text-center text-gray-500">
          {{ t("common.loading") }}...
        </div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <form @submit.prevent="saveProduct" v-else>
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t("products.name") }}
            </label>
            <InputText
              id="name"
              v-model="productForm.name"
              class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t("products.price") }}
            </label>
            <InputNumber
              id="price"
              v-model="productForm.price"
              mode="currency"
              currency="USD"
              locale="en-US"
              class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t("products.category") }}
            </label>
            <Dropdown
              id="category"
              v-model="productForm.categoryId"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="t('products.selectCategory')"
              class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t("products.description") }}
            </label>
            <Textarea
              id="description"
              v-model="productForm.description"
              rows="5"
              class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <Button
              :label="t('common.cancel')"
              severity="secondary"
              @click="cancel"
              class="p-button-secondary"
            />
            <Button
              :label="t('common.save')"
              type="submit"
              class="p-button-primary"
              :loading="loading"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* You might need to add specific styles to override PrimeVue defaults
   or ensure dark mode compatibility for dropdowns etc. */
</style>
