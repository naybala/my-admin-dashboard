import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { Product } from "@customTypes/index";

export function useProductTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo } = useAppToast();

  const {
    filteredItems: filteredProducts,
    loading,
    error,
    searchTerm,
    fetchAll,
    deleteItem,
  } = useCrud<Product>({
    apiPath: "api/products",
  });

  onMounted(fetchAll);

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
          await deleteItem(product.id);
          showSuccess(t("common.success"), t("products.productDeleted"));
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("products.productNotDeleted"));
      },
    });
  };

  return {
    t,
    filteredProducts,
    loading,
    error,
    searchTerm,
    openNewProductForm,
    editProduct,
    confirmDeleteProduct,
  };
}
