<template>
  <div>
    <input type="file" @change="onChange" accept="image/*" />
    <img v-if="modelValue" :src="modelValue" class="w-32 mt-2" />
    <p v-if="uploading">Uploading...</p>
  </div>
</template>

<script setup lang="ts">
import { useImageUpload } from "@/composables/common/useImageUpload";
import { defineEmits, defineProps } from "vue";

defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const { uploadImage, uploading } = useImageUpload();

const onChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const url = await uploadImage(file);
  if (url) emit("update:modelValue", url);
};
</script>
