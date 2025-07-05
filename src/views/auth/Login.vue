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
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from "vue-router";
import useAuthData from "../../composables/auth";

const email = ref("");
const password = ref("");
const toast = useToast();
const router = useRouter();
const route = useRoute();
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
      toast.add({
        severity: "success",
        summary: `Welcome ${response.data.user.name}!`,
        detail: "Login successful.",
        life: 5000,
      });

      // Redirect to intended page or home
      const redirectTo = (route.query.redirect as string) || "/";
      router.push(redirectTo);
    } else {
      error.value = "Login failed. Please try again.";
    }
  } catch (err) {
    error.value = "An unexpected error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
