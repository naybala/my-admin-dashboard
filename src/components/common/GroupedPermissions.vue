<template>
  <div class="border border-red-600 rounded-md p-5">
    <div
      v-for="(perms, entity) in groupedPermissions"
      :key="entity"
      class="mb-6 border-b pb-4"
    >
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-semibold capitalize">{{ entity }}</h2>
        <div class="space-x-2">
          <button
            type="button"
            class="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            @click="selectAll(entity)"
          >
            Select All
          </button>
          <button
            type="button"
            class="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            @click="unselectAll(entity)"
          >
            Unselect All
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <label
          v-for="perm in perms"
          :key="perm"
          class="inline-flex items-center space-x-2"
        >
          <input type="checkbox" :value="perm" v-model="modelValue" />
          <span>{{ perm }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  permissions: string[];
  modelValue: string[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const groupedPermissions = computed(() => {
  const grouped: Record<string, string[]> = {};

  props.permissions.forEach((perm) => {
    const parts = perm.split(" ");
    const entity = parts.slice(1).join(" ");
    if (!grouped[entity]) grouped[entity] = [];
    grouped[entity].push(perm);
  });

  return grouped;
});

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function selectAll(entity: string) {
  const perms = groupedPermissions.value[entity] ?? [];
  emit(
    "update:modelValue",
    Array.from(new Set([...props.modelValue, ...perms]))
  );
}

function unselectAll(entity: string) {
  const perms = groupedPermissions.value[entity] ?? [];
  emit(
    "update:modelValue",
    props.modelValue.filter((p) => !perms.includes(p))
  );
}
</script>
