import { ref } from "vue";
import { useAppToast } from "@/composables/common/useAppToast";

export function useImageUpload() {
  const { showError } = useAppToast();
  const uploading = ref(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      uploading.value = true;
      const res = await fetch("https://admin.bigsoft.tech/upload/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data?.url) throw new Error(data.message || "Upload failed");
      return data.url;
    } catch (err: any) {
      showError("Upload Error", err.message);
      return null;
    } finally {
      uploading.value = false;
    }
  };

  return {
    uploading,
    uploadImage,
  };
}
