// useCrud.ts
import { ref, computed } from "vue";
import type { Ref } from "vue";
import type { CrudOptions } from "../../types/crudType";
import { apiRequest } from "./useApi";

export function useCrud<T extends { id?: string | number }>(options: CrudOptions<T>) {
  const { apiPath, idKey = "id" } = options;

  const items: Ref<T[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedItem: Ref<T | null> = ref(null);
  const searchTerm = ref("");

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await apiRequest<any>(apiPath);
      items.value = Array.isArray(result) ? result : result.data;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const fetchOne = async (id: string | number) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await apiRequest<any>(`${apiPath}/${id}`);
      selectedItem.value = Array.isArray(result) ? result : result.data;
    } catch (e: any) {
      error.value = e.message;
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
      await fetchAll();
      return newItem;
    } catch (e: any) {
      error.value = e.message;
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
      await fetchAll();
      return updatedItem;
    } catch (e: any) {
      error.value = e.message;
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
      await fetchAll();
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const filteredItems = computed(() => {
    if (!searchTerm.value) return items.value;
    const lower = searchTerm.value.toLowerCase();
    return items.value.filter(item =>
      Object.values(item).some(val => String(val).toLowerCase().includes(lower))
    );
  });

  return {
    items,
    filteredItems,
    loading,
    error,
    selectedItem,
    searchTerm,
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
  };
}
