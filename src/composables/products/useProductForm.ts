import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Product } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateProductForm } from "./validateProductForm";
import { apiRequest } from "../common/useApi";


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

    type PresignedResponse = {
      urls: Array<{
        filename: string;
        key: string;
        url: string;
      }>;
    };

    try {
      // 2. Only proceed with image upload if there are files
      if (productForm.value.imageFiles?.length > 0) {
        // 2a. Get pre-signed URLs
        const filesMeta = productForm.value.imageFiles.map((file) => ({
          filename: file.name,
          contentType: file.type,
        }));
        const res = await apiRequest<{ success: boolean; data: PresignedResponse }>("api/web/get-presigned-urls", {
          method: "POST",
          body: JSON.stringify({ files: filesMeta }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.success) throw new Error("Failed to get pre-signed URLs");
        const urls  = res.data.urls;       
    
        // 2b. Upload each file to its corresponding signed URL
        for (let i = 0; i < productForm.value.imageFiles.length; i++) {
          const file = productForm.value.imageFiles[i];
          const uploadUrl = urls[i]['url'];

          const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type , "x-amz-acl": "public-read"},
          });

          if (!uploadRes.ok) throw new Error(`Upload failed for ${file.name}`);
        }

        // 2c. Store final public URLs in form
        productForm.value.imageUrls = urls.map((entry:any) => `${entry.key}`);
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
