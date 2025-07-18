// useCrud.ts
import { ref } from "vue";
import type { Ref } from "vue";
import type { CrudOptions } from "@customTypes/crudType";
import { apiRequest } from "./useApi";

export function useCrud<T extends { id?: string | number }>(options: CrudOptions<T>) {
  const { apiPath, idKey = "id" } = options;

  const items: Ref<T[]> = ref([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const selectedItem: Ref<T | null> = ref(null);
  const total: Ref<number> = ref(0);
  const page: Ref<number> = ref(1);
  const limit: Ref<number> = ref(10);

  const fetchAll = async (queryParams: Record<string, any> = {}) => {
    error.value = null;
    try {
      // Merge default pagination with custom query params
      const params = new URLSearchParams({
        ...queryParams,
        page: queryParams.page?.toString() || page.value.toString(),
        limit: queryParams.limit?.toString() || limit.value.toString(),
      }).toString();

      const result = await apiRequest<{
        data: {
          data: T[];       
          total: number;
          page?: number;
          limit?: number;
        };
      }>(`${apiPath}?${params}`);

      items.value = result.data.data;
      total.value = result.data.total ?? result.data.data.length;
      
      // Update page and limit from query params if provided
      if (queryParams.page) page.value = parseInt(queryParams.page);
      if (queryParams.limit) limit.value = parseInt(queryParams.limit);
      
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchOne = async (id: string | number) => {
    loading.value = false;
    error.value = null;
    try {
      const result = await apiRequest<any>(`${apiPath}/${id}`);
      selectedItem.value = Array.isArray(result) ? result : result.data;
      return result;
    } catch (e: any) {
      const responseData = e.responseData;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        error.value = responseData.errors.map((err: any) => err.message).join(', ');
      } else {
        error.value = responseData?.message || e.message || "An unknown error occurred.";
      }
      console.log(error.value);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const createItem = async (item: T) => {
    loading.value = true;
    error.value = null;
    try {
      const newItem = await apiRequest<T>(apiPath, {
        method: "POST",
        body: JSON.stringify(item),
      });
      await fetchAll(); // Refresh data after creation
      return newItem;
    } catch (e: any) {
      const responseData = e.responseData;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        error.value = responseData.errors.map((err: any) => err.message).join(', ');
      } else {
        error.value = responseData?.message || e.message || "An unknown error occurred.";
      }
      console.log(error.value);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (updatedFields: any) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedItem = await apiRequest<T>(`${apiPath}`, {
        method: "PUT",
        body: JSON.stringify(updatedFields),
      });
      await fetchAll(); // Refresh data after update
      return updatedItem;
    } catch (e: any) {
      const responseData = e.responseData;
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          error.value = responseData.errors.map((err: any) => err.message).join(', ');
        } else {
          error.value = responseData?.message || e.message || "An unknown error occurred.";
        }
        console.log(error.value);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteItem = async (id: string | number) => {
    loading.value = true;
    error.value = null;
    try {
      await apiRequest(`${apiPath}/${id}`, {
        method: "DELETE",
      });
      await fetchAll(); // Refresh data after deletion
    } catch (e: any) {
      const responseData = e.responseData;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        error.value = responseData.errors.map((err: any) => err.message).join(', ');
      } else {
        error.value = responseData?.message || e.message || "An unknown error occurred.";
      }
      console.log(error.value);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    loading,
    error,
    selectedItem,
    page,
    limit,
    total,
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
  };
}