<script setup lang="ts">
import { useUserForm } from "@composables/users/useUserForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";

const { t, isEditMode, form, save, validationErrors, cancel, error, saving } =
  useUserForm();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{ isEditMode ? t("users.edit") : t("users.add") }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <form @submit.prevent="save">
          <NameField
            v-model="form.name"
            :label="t('users.name')"
            :error="validationErrors.name"
          />

          <NameField
            v-model="form.email"
            :label="t('users.email')"
            :error="validationErrors.email"
          />

          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="saving"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
