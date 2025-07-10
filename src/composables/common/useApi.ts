import { useAuthStore } from "@stores/auth";

export async function apiRequest<T>(
  api: string,
  options: RequestInit = {}
): Promise<T> {
  const authStore = useAuthStore();
  const token = authStore.token;
  const fullUrl = import.meta.env.VITE_BASE_URL + "/" + api;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(fullUrl, { ...options, headers });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "API request failed");
    // Attach full server response data to the error
    (error as any).responseData = data;
    throw error;
  }

  return data;
}

