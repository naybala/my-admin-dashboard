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

  try {
    // 2. Only proceed with image upload if there are files
    if (productForm.value.imageFiles?.length > 0) {
      // 2a. Get pre-signed URLs
      const filesMeta = productForm.value.imageFiles.map((file) => ({
        filename: file.name,
        contentType: file.type,
      }));
      const res = await fetch(import.meta.env.VITE_BASE_URL +"/api/get-presigned-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesMeta }),
      });

      if (!res.ok) throw new Error("Failed to get pre-signed URLs");
      const { urls } = await res.json(); // Backend returns: { urls: [PUT URLs], finalUrls: [public URLs] }
      
      

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
      const publicBaseUrl = "https://property-area-dev.sgp1.digitaloceanspaces.com";
      productForm.value.imageUrls = urls.map((entry:any) => `${publicBaseUrl}/${entry.key}`);
    }

    // 3. Submit product data (with images)
    if (isEditMode.value && productId) {
      await updateItem(productForm.value);
      showSuccess(t("common.success"), t("products.productUpdated"));
    } else {
      console.log(productForm.value);
      
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
