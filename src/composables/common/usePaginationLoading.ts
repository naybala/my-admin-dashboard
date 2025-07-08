import { Ref, watch } from "vue";

export function usePaginationLoading(
  rowsPerPage: Ref<number>,
  loading: Ref<boolean>
) {
  watch(rowsPerPage, async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 100));
    loading.value = false;
  });

  const onPageChange = () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 100);
  };

  const onRowsChange = (newRows: number) => {
    rowsPerPage.value = newRows;
  };

  return { onPageChange, onRowsChange };
}
