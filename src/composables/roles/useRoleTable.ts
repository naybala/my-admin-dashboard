// useRoleTable.ts
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { RoleIndex } from "@customTypes/index";
import type { Role } from "@customTypes/index";
import { apiRequest } from "../common/useApi";


export function useRoleTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo } = useAppToast();

  const searchTerm = ref("");
  
  const {
    items: roles,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<RoleIndex>({
    apiPath: "api/web/roles",
  });

 // Debounce search requests
  let debounceTimer: ReturnType<typeof setTimeout>;
  
  const fetchData = async (newPage?: number, newLimit?: number) => {
    clearTimeout(debounceTimer);
    
    return new Promise<void>((resolve) => {
      debounceTimer = setTimeout(async () => {
        try {
          await fetchAll({
            page: newPage || page.value,
            limit: newLimit || limit.value,
            search: searchTerm.value
          });
          resolve();
        } catch (e) {
          console.error("Fetch error:", e);
        }
      }, 300);
    });
  };


  onMounted(async () => {
    await fetchData().then(() => {
      console.log("Initial data loaded. Page:", page.value, "Limit:", limit.value, "Total:", total.value);
    });
   
  });

  // Watch for search term changes
  watch(searchTerm, () => {
    fetchData(1);
  });

  const openNewRoleForm = () => {
    router.push({ name: "role-new" });
  };

  const editRole = (role: Role) => {
    router.push({ name: "role-edit", params: { id: role.id } });
  };

  const confirmDeleteRole = (event: Event, role: Role) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("roles.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (role.id) {
          try {
            await deleteItem(role.id);
            showSuccess(t("common.success"), t("roles.roleDeleted"));
            await fetchData(page.value, limit.value); 
          } catch (e) {
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("roles.roleNotDeleted"));
      },
    });
  };

  return {
    t,
    roles,
    loading,
    error,
    searchTerm,
    page,
    limit,
    total,
    fetchData,
    openNewRoleForm,
    editRole,
    confirmDeleteRole,
  };
}