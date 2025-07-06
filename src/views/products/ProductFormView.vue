<script setup lang="ts">
import { useProductForm } from "../../composables/products/useProductForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "../../components/common/NameField.vue";
import Description from "../../components/common/Description.vue";
import SelectItem from "../../components/common/SelectItem.vue";
import FormActions from "../../components/common/FormActions.vue";

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
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <div v-if="loading" class="text-center text-gray-500">
          {{ t("common.loading") }}...
        </div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <form @submit.prevent="saveProduct" v-else>
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
            :loading="loading"
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
