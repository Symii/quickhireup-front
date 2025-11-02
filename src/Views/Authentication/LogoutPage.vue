<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/api/authentication/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();

auth.logout();
router.push('/login');
</script>
