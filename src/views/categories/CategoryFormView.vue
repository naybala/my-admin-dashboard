<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../../composables/useCrud";
import type { Category } from "../../types";

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();

const categoryId = route.params.id ? Number(route.params.id) : null;

const {
  selectedItem: category,
  loading,
  error,
  fetchOne,
  createItem,
  updateItem,
} = useCrud<Category>({ apiPath: "categories" });

const isEditMode = ref(false);

const categoryForm = ref<Category>({
  name: "",
  description: "",
});

onMounted(async () => {
  if (categoryId) {
    isEditMode.value = true;
    await fetchOne(categoryId);
    if (category.value) {
      categoryForm.value = JSON.parse(JSON.stringify(category.value));
    }
  }
});

watch(category, (newVal) => {
  if (newVal) {
    categoryForm.value = JSON.parse(JSON.stringify(newVal));
  }
});

const saveCategory = async () => {
  if (isEditMode.value && categoryId) {
    await updateItem(categoryId, categoryForm.value);
    if (!error.value) {
      toast.add({
        severity: "success",
        summary: t("common.success"),
        detail: t("categories.categoryUpdated"),
        life: 3000,
      });
      router.push({ name: "categories" });
    } else {
      toast.add({
        severity: "error",
        summary: t("common.error"),
        detail: error.value,
        life: 3000,
      });
    }
  } else {
    await createItem(categoryForm.value);
    if (!error.value) {
      toast.add({
        severity: "success",
        summary: t("common.success"),
        detail: t("categories.categoryCreated"),
        life: 3000,
      });
      router.push({ name: "categories" });
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
  router.push({ name: "categories" });
};
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{ isEditMode ? t("categories.edit") : t("categories.add") }}
      {{ t("categories.title") }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <div v-if="loading" class="text-center text-gray-500">
          {{ t("common.loading") }}...
        </div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <form @submit.prevent="saveCategory" v-else>
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t("categories.name") }}
            </label>
            <InputText
              id="name"
              v-model="categoryForm.name"
              class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {{ t("categories.description") }}
            </label>
            <Textarea
              id="description"
              v-model="categoryForm.description"
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
