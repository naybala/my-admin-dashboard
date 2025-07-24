import { ref, onMounted, watch, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Product } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateProductForm } from "./validateProductForm";
import { uploadImages } from "../common/uploadImage";


export function useProductForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const saving:Ref<boolean> = ref(false);


  const productId = route.params.id ? Number(route.params.id) : null;
  const isEditMode = ref(!!productId);

  const {
    selectedItem: product,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<Product>({ apiPath: "api/web/products" });

  const productForm = ref<Product>({
    name: "",
    categoryId: 0,
    description: "",
    images: [] as string[],
    imageFiles: [] as File[],
    imageUrls: [] as string[] // after upload
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
  // 1. Validate product form fields
    validationErrors.value = validateProductForm(productForm.value, t);

    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

   

    saving.value = true;
    try {
      // 2. Only proceed with image upload if there are files
      if (productForm.value.imageFiles?.length > 0) {
        const uploadedKeys = await uploadImages(productForm.value.imageFiles);
        const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
        productForm.value.imageUrls = [
          ...productForm.value.imageUrls,
          ...uploadedKeys,
        ];
        productForm.value.imageUrls = productForm.value.imageUrls.map((url) =>
          url.startsWith(CDN_PREFIX) ? url.replace(CDN_PREFIX, "") : url
        );
         
      }

      // 3. Submit product data (with images)
      if (isEditMode.value && productId) {      
        await updateItem(productForm.value);
        showSuccess(t("common.success"), t("products.productUpdated"));
      } else {      
        await createItem(productForm.value);
        showSuccess(t("common.success"), t("products.productCreated"));
      }

      // 4. Redirect
      router.push({ name: "products" });

    } catch (err: any) {
      console.error("Save failed:", err);
      showError(t("common.error"), err.message || "An unexpected error occurred");
    } finally {
      saving.value = false; 
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
    saving,
  };
}
