<template>
  <div class="flex justify-center">
    <div class="text-center bg-brand-primary text-white p-10">
      <h1 class="mt-5 text-brand-secondary mb-5 text-xl">
        Welcome to Hello Dashboard
      </h1>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="mb-5 text-black px-2 rounded-md"
      />
      <br />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="text-black px-2 rounded-md"
      />
      <br />
      <button
        @click="handleLogin"
        class="cursor-pointer mt-5 bg-[#2e1717] px-5 rounded-sm"
      >
        Login
      </button>
      <p v-if="error" style="color: red">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import useAuthData from "@composables/auth";
import { useAppToast } from "@composables/common/useAppToast";

const email = ref("");
const password = ref("");
const router = useRouter();
const route = useRoute();

const { showSuccess, showError } = useAppToast();
const { success, loading, error, fetchAuthData } = useAuthData();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Please enter both email and password.";
    return;
  }

  try {
    loading.value = true;

    const credentials = {
      email: email.value,
      password: password.value,
    };

    const response = await fetchAuthData(credentials);

    if (success.value && response?.data?.token && response?.data?.user) {
      showSuccess(
        `Welcome ${response.data.user.name}!`,
        "Login successful.",
        5000
      );
      const redirectTo = (route.query.redirect as string) || "/dashboard";
      router.push(redirectTo);
    } else {
      error.value = "Login failed. Please try again.";
      showError("Login failed", error.value);
    }
  } catch (err) {
    error.value = "An unexpected error occurred. Please try again.";
    showError("Error", error.value);
  } finally {
    loading.value = false;
  }
};
</script>
