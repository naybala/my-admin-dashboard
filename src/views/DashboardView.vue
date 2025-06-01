<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Card from "primevue/card";
import Chart from "primevue/chart";

const { t } = useI18n();

const chartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Sales",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "#42A5F5",
      tension: 0.4,
    },
    {
      label: "Orders",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      borderColor: "#66BB6A",
      tension: 0.4,
    },
  ],
};
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("sidebar.dashboard") }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
        <template #title>Total Products</template>
        <template #content>
          <p class="text-4xl font-bold">120</p>
        </template>
      </Card>

      <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
        <template #title>Total Categories</template>
        <template #content>
          <p class="text-4xl font-bold">15</p>
        </template>
      </Card>

      <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
        <template #title>Recent Sales</template>
        <template #content>
          <p class="text-4xl font-bold">$12,450</p>
        </template>
      </Card>
    </div>

    <div class="mt-8">
      <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
        <template #title>Sales Overview</template>
        <template #content>
          <Chart
            type="line"
            :data="chartData"
            :options="chartOptions"
            class="h-80"
          />
        </template>
      </Card>
    </div>
  </div>
</template>
