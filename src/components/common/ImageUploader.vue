<template>
  <div>
    <input type="file" multiple accept="image/*" @change="onSelectFiles" />

    <div class="flex gap-2 mt-4 flex-wrap">
      <div
        v-for="(url, idx) in combinedPreviews"
        :key="idx"
        class="relative group w-32 h-32 border rounded overflow-hidden"
      >
        <img :src="url" class="w-full h-full object-cover" />
        <button
          @click.prevent="removeFile(idx)"
          class="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100"
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  modelValue: File[] | undefined; // new files to upload
  initialUrls?: string[]; // existing image URLs
}>();

const emit = defineEmits([
  "update:modelValue", // emit changes to new files
  "update:initialUrls", // emit changes to existing URLs
]);

// Internal reactive state for new files and existing URLs
const newFiles = ref<File[]>(props.modelValue ?? []);
const existingUrls = ref<string[]>(props.initialUrls ?? []);

// Update previews for new files (generate object URLs)
const previewUrls = ref<string[]>([]);

const updatePreviews = (files: File[]) => {
  previewUrls.value.forEach(URL.revokeObjectURL);
  previewUrls.value = files.map((file) => URL.createObjectURL(file));
};

// Watch for external changes to new files
watch(
  () => props.modelValue,
  (files) => {
    newFiles.value = files ?? [];
    updatePreviews(newFiles.value);
  },
  { immediate: true, deep: true }
);

// Watch for external changes to initial URLs
watch(
  () => props.initialUrls,
  (urls) => {
    existingUrls.value = urls ?? [];
  },
  { immediate: true, deep: true }
);

// Combined list of image previews for display
const combinedPreviews = computed(() => [
  ...existingUrls.value,
  ...previewUrls.value,
]);

// Remove image by index from combined previews
const removeFile = (index: number) => {
  if (index < existingUrls.value.length) {
    // Remove from existing URLs
    existingUrls.value.splice(index, 1);
    emit("update:initialUrls", [...existingUrls.value]);
  } else {
    // Remove from new files
    const fileIndex = index - existingUrls.value.length;
    newFiles.value.splice(fileIndex, 1);
    emit("update:modelValue", [...newFiles.value]);
    updatePreviews(newFiles.value);
  }
};

// Add new selected files
const onSelectFiles = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const addedFiles = Array.from(input.files ?? []);
  newFiles.value = [...newFiles.value, ...addedFiles];
  emit("update:modelValue", [...newFiles.value]);
  updatePreviews(newFiles.value);

  // Reset input so same files can be selected again if needed
  input.value = "";
};
</script>
