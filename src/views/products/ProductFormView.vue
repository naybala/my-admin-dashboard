<script setup lang="ts">
import { useProductForm } from "../../composables/products/useProductForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Button from "primevue/button";

const {
  t,
  isEditMode,
  productForm,
  categories,
  saveProduct,
  validationErrors,
  cancel,
  loading,
  error,
} = useProductForm();
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
          <!-- Name -->
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
            />
            <p v-if="validationErrors.name" class="text-red-500 text-sm mt-1">
              {{ validationErrors.name }}
            </p>
          </div>

          <!-- Category -->
          <div class="mb-4">
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t("products.category") }}
            </label>
            <Select
              id="category"
              v-model="productForm.categoryId"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              :placeholder="t('products.selectCategory')"
              class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
            <p
              v-if="validationErrors.categoryId"
              class="text-red-500 text-sm mt-1"
            >
              {{ validationErrors.categoryId }}
            </p>
          </div>

          <!-- Description -->
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

          <!-- Actions -->
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

<style scoped></style>
