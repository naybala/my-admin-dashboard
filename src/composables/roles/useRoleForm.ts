import { ref, onMounted, watch, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Role } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateRoleForm } from "./validateRoleForm";
import { apiRequest } from "../common/useApi";


export function useRoleForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const saving:Ref<boolean> = ref(false);
  const permissions = ref<any>([]);



  const roleId = route.params.id ? Number(route.params.id) : null;
  const isEditMode = ref(!!roleId);

  const {
    selectedItem: role,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<Role>({ apiPath: "api/web/roles" });

  const roleForm = ref<Role>({
    name: "",
    description: "",
    permissions: [],
  });

  const validationErrors = ref<Record<string, string>>({});


  onMounted(async () => {
    if (isEditMode.value && roleId) {
      await fetchOne(roleId);
      if (role.value) {
        roleForm.value = { ...role.value };
      }
    }
     const response =  await apiRequest<any>('api/web/roles/get-all-permission', {
        method: "POST",
      });
      permissions.value = response.data;
  });

  watch(role, (newVal) => {
    if (newVal) {
      roleForm.value = { ...newVal };
    }
  });

  const saveRole = async () => {
    console.log(roleForm.value);
    
  // 1. Validate role form fields
    validationErrors.value = validateRoleForm(roleForm.value, t);

    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    // 2. Save role data
    saving.value = true;
    try {

      // 3. Submit role data
      if (isEditMode.value && roleId) {      
        await updateItem(roleForm.value);
        showSuccess(t("common.success"), t("roles.roleUpdated"));
      } else {      
        await createItem(roleForm.value);
        showSuccess(t("common.success"), t("roles.roleCreated"));
      }

      // 4. Redirect
      router.push({ name: "roles" });   

    } catch (err: any) {
      console.error("Save failed:", err);
      showError(t("common.error"), err.message || "An unexpected error occurred");
    } finally {
      saving.value = false; 
    }
  };


  const cancel = () => {
    router.push({ name: "roles" });
  };

  return {
    t,
    isEditMode,
    roleForm,
    validationErrors, 
    saveRole,
    cancel,
    loading,
    error,
    saving,
    permissions,
  };
}
