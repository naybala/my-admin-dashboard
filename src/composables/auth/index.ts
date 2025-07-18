import type { AuthResponse } from "@customTypes/auth";
import { ref } from "vue";
import { useAuthStore } from "@stores/auth";
import { apiRequest } from "@composables/common/useApi";

export default function useAuthData() {
  const success = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  const fetchAuthData = async (
    data: { email: string; password: string }
  ): Promise<AuthResponse | null> => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const responseData = await apiRequest<AuthResponse>(
        "api/web/auth/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      authStore.setToken(responseData.data.token);
      success.value = true;
      return responseData;
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    success,
    loading,
    error,
    fetchAuthData,
  };
}
