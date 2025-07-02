import { ref, computed } from 'vue'
import type { Ref } from 'vue'

interface CrudOptions<T> {
  apiPath: string
  idKey?: keyof T
}

export function useCrud<T extends { id?: string | number }>(options: CrudOptions<T>) {
  const { apiPath, idKey = 'id' } = options

  const items: Ref<T[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedItem: Ref<T | null> = ref(null)
  const searchTerm = ref('')

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(apiPath)
      if (!response.ok) throw new Error('Failed to fetch items')
      const result = await response.json()
      items.value = Array.isArray(result) ? result : result.data
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
      const response = await fetch(`${apiPath}/${id}`)
      if (!response.ok) throw new Error('Failed to fetch item')
      const result = await response.json()
      selectedItem.value = Array.isArray(result) ? result : result.data
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
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (!response.ok) throw new Error('Failed to create item')
      const newItem = await response.json()
      await fetchAll()
      return newItem
    } catch (e: any) {
      error.value = e.message || 'Failed to create item.'
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (updatedFields:any) => {
    loading.value = true
    error.value = null
    console.log(updatedFields);
    
    try {
      const response = await fetch(`${apiPath}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      })
      if (!response.ok) throw new Error('Failed to update item')
      const updatedItem = await response.json()
      await fetchAll()
      return updatedItem
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
      const response = await fetch(`${apiPath}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete item')
      await fetchAll()
    } catch (e: any) {
      error.value = e.message || 'Failed to delete item.'
    } finally {
      loading.value = false
    }
  }

  const filteredItems = computed(() => {
    if (!searchTerm.value) return items.value
    const lower = searchTerm.value.toLowerCase()
    return items.value.filter(item =>
      Object.values(item).some(val => String(val).toLowerCase().includes(lower))
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
