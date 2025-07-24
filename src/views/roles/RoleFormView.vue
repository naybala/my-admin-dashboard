<script setup lang="ts">
import { useRoleForm } from "@composables/roles/useRoleForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import GroupedPermissions from "@/components/common/GroupedPermissions.vue";

const {
  t,
  isEditMode,
  roleForm,
  saveRole,
  validationErrors,
  cancel,
  error,
  saving,
  permissions,
} = useRoleForm();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{ isEditMode ? t("roles.edit") : t("roles.add") }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <form @submit.prevent="saveRole">
          <!-- Name -->
          <NameField
            v-model="roleForm.name"
            :label="t('roles.name')"
            :error="validationErrors.name"
          />

          <!-- Description -->
          <Description
            v-model="roleForm.description"
            :label="t('roles.description')"
          />
          <GroupedPermissions
            :permissions="permissions"
            v-model="roleForm.permissions"
          />

          <!-- Actions -->
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
