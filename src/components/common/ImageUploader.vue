<template>
  <div>
    <input type="file" multiple accept="image/*" @change="onSelectFiles" />

    <div class="flex gap-2 mt-4 flex-wrap">
      <div
        v-for="(file, idx) in modelValue"
        :key="idx"
        class="relative group w-32 h-32 border rounded overflow-hidden"
      >
        <img :src="previewUrls[idx]" class="w-full h-full object-cover" />
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
import { ref, watch } from "vue";

const props = defineProps<{ modelValue: File[] }>();
const emit = defineEmits(["update:modelValue"]);

const previewUrls = ref<string[]>([]);

// Generate object URLs for preview
const updatePreviews = (files: File[]) => {
  previewUrls.value.forEach(URL.revokeObjectURL); // clean up old ones
  previewUrls.value = files.map((file) => URL.createObjectURL(file));
};

// Watch for external updates to modelValue
watch(
  () => props.modelValue,
  (files) => {
    updatePreviews(files);
  },
  { immediate: true, deep: true }
);

// Select and append files
const onSelectFiles = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const newFiles = Array.from(input.files || []);
  const updated = [...props.modelValue, ...newFiles];
  emit("update:modelValue", updated);
  updatePreviews(updated);

  // Reset input after selection
  input.value = "";
};

// Remove selected file
const removeFile = (index: number) => {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit("update:modelValue", updated);
  updatePreviews(updated);
};
</script>
