import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Product } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateProductForm } from "./validateProductForm";

export function useProductForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const productId = route.params.id ? Number(route.params.id) : null;
  const isEditMode = ref(!!productId);

  const {
    selectedItem: product,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<Product>({ apiPath: "api/products" });

  const productForm = ref<Product>({
    name: "",
    price: 0,
    categoryId: 0,
    description: "",
  });

  const validationErrors = ref<Record<string, string>>({});

  const categories = [
    { name: "Category 1", id: 1 },
    { name: "Category 2", id: 2 },
  ];

  onMounted(async () => {
    if (isEditMode.value && productId) {
      await fetchOne(productId);
      if (product.value) {
        productForm.value = { ...product.value };
      }
    }
  });

  watch(product, (newVal) => {
    if (newVal) {
      productForm.value = { ...newVal };
    }
  });

  const saveProduct = async () => {
    validationErrors.value = validateProductForm(productForm.value,t);

    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    if (isEditMode.value && productId) {
      await updateItem(productForm.value);
      if (!error.value) {
        showSuccess(t("common.success"), t("products.productUpdated"));
        router.push({ name: "products" });
      } else {
        showError(error.value);
      }
    } else {
      await createItem(productForm.value);
      if (!error.value) {
        showSuccess(t("common.success"), t("products.productCreated"));
        router.push({ name: "products" });
      } else {
        showError(t("common.error"), error.value);
      }
    }
  };

  const cancel = () => {
    router.push({ name: "products" });
  };

  return {
    t,
    isEditMode,
    productForm,
    categories,
    validationErrors, 
    saveProduct,
    cancel,
    loading,
    error,
  };
}
