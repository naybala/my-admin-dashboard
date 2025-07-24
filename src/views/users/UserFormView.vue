<script setup lang="ts">
import { useUserForm } from "@composables/users/useUserForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import SelectItem from "@/components/common/SelectItem.vue";
import PasswordField from "@/components/common/PasswordField.vue";

const {
  t,
  isEditMode,
  form,
  save,
  validationErrors,
  cancel,
  error,
  saving,
  roles,
} = useUserForm();

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
          <!-- Name -->
          <NameField
            v-model="form.name"
            :label="t('users.name')"
            :error="validationErrors.name"
          />
          <!-- Email -->
          <NameField
            v-model="form.email"
            :label="t('users.email')"
            :error="validationErrors.email"
          />
          <!-- Role -->
          <SelectItem
            id="role"
            v-model="form.roleId"
            :label="t('users.role')"
            :options="roles"
            :placeholder="t('users.selectRole')"
            :error="validationErrors.roleId"
          />

          <PasswordField
            v-model="form.password"
            :label="t('users.password')"
            :placeholder="t('users.enterPassword')"
            :error="validationErrors.password"
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
