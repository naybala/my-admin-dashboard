import { ref, computed } from 'vue'
import type { Ref } from 'vue'

interface CrudOptions<T> {
  apiPath: string; 
  idKey?: keyof T;
}

export function useCrud<T extends { id?: string | number }>(options: CrudOptions<T>) {
  const { apiPath, idKey = 'id' } = options

  const items: Ref<T[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedItem: Ref<T | null> = ref(null)

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await new Promise<T[]>(resolve => {
        setTimeout(() => {
          const data: T[] = JSON.parse(localStorage.getItem(apiPath) || '[]')
          resolve(data)
        }, 500)
      })
      items.value = response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch items.'
    } finally {
      loading.value = false
    }
  }

  const fetchOne = async (id: string | number) => {
    loading.value = true
    error.value = null
    try {
      const response = await new Promise<T | undefined>(resolve => {
        setTimeout(() => {
          const data: T[] = JSON.parse(localStorage.getItem(apiPath) || '[]')
          const item = data.find(item => item[idKey as keyof T] == id)
          resolve(item)
        }, 300)
      })
      selectedItem.value = response || null
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch item.'
    } finally {
      loading.value = false
    }
  }

  const createItem = async (item: T) => {
    loading.value = true
    error.value = null
    try {
      const response = await new Promise<T>(resolve => {
        setTimeout(() => {
          const data: T[] = JSON.parse(localStorage.getItem(apiPath) || '[]')
          const newItem = { ...item, [idKey]: data.length > 0 ? Math.max(...data.map(i => i[idKey as keyof T] as number)) + 1 : 1 } as T;
          data.push(newItem)
          localStorage.setItem(apiPath, JSON.stringify(data))
          resolve(newItem)
        }, 300)
      })
      await fetchAll(); // Refresh list
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create item.'
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id: string | number, updatedFields: Partial<T>) => {
    loading.value = true
    error.value = null
    try {
      const response = await new Promise<T | undefined>(resolve => {
        setTimeout(() => {
          let data: T[] = JSON.parse(localStorage.getItem(apiPath) || '[]')
          const index = data.findIndex(item => item[idKey as keyof T] == id)
          if (index !== -1) {
            data[index] = { ...data[index], ...updatedFields }
            localStorage.setItem(apiPath, JSON.stringify(data))
            resolve(data[index])
          } else {
            resolve(undefined)
          }
        }, 300)
      })
      await fetchAll(); // Refresh list
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update item.'
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id: string | number) => {
    loading.value = true
    error.value = null
    try {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          let data: T[] = JSON.parse(localStorage.getItem(apiPath) || '[]')
          data = data.filter(item => item[idKey as keyof T] != id)
          localStorage.setItem(apiPath, JSON.stringify(data))
          resolve()
        }, 300)
      })
      await fetchAll(); // Refresh list
    } catch (e: any) {
      error.value = e.message || 'Failed to delete item.'
    } finally {
      loading.value = false
    }
  }

  const searchTerm = ref('')
  const filteredItems = computed(() => {
    if (!searchTerm.value) {
      return items.value
    }
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
    return items.value.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowerCaseSearchTerm)
      )
    )
  })

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
  }
}