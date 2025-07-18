// useProductTable.ts
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { ProductIndex } from "@customTypes/index";
import type { Product } from "@customTypes/index";

export function useProductTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo } = useAppToast();

  const searchTerm = ref("");
  
  const {
    items: products,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<ProductIndex>({
    apiPath: "api/web/products",
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


  onMounted(() => {
    fetchData().then(() => {
      console.log("Initial data loaded. Page:", page.value, "Limit:", limit.value, "Total:", total.value);
    });
  });

  // Watch for search term changes
  watch(searchTerm, () => {
    fetchData(1);
  });

  const openNewProductForm = () => {
    router.push({ name: "product-new" });
  };

  const editProduct = (product: Product) => {
    router.push({ name: "product-edit", params: { id: product.id } });
  };

  const confirmDeleteProduct = (event: Event, product: Product) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("products.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (product.id) {
          try {
            await deleteItem(product.id);
            showSuccess(t("common.success"), t("products.productDeleted"));
            await fetchData(page.value, limit.value); 
          } catch (e) {
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("products.productNotDeleted"));
      },
    });
  };

  return {
    t,
    products,
    loading,
    error,
    searchTerm,
    page,
    limit,
    total,
    fetchData,
    openNewProductForm,
    editProduct,
    confirmDeleteProduct,
  };
}