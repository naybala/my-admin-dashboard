import { useAuthStore } from "../../stores/auth";

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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return await response.json();
}
