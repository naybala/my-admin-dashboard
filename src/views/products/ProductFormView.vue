<script setup lang="ts">
import { useProductForm } from "@composables/products/useProductForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import SelectItem from "@components/common/SelectItem.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
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

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{ isEditMode ? t("products.edit") : t("products.add") }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <form @submit.prevent="saveProduct">
          <!-- Name -->
          <NameField
            v-model="productForm.name"
            :label="t('products.name')"
            :error="validationErrors.name"
          />

          <!-- Category -->
          <SelectItem
            id="category"
            v-model="productForm.categoryId"
            :label="t('products.category')"
            :options="categories"
            :placeholder="t('products.selectCategory')"
            :error="validationErrors.categoryId"
          />

          <!-- Description -->
          <Description
            v-model="productForm.description"
            :label="t('products.description')"
          />

          <!-- Actions -->
          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
