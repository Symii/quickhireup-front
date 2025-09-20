<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { logout } = useAuth();

logout().then(() => {
  router.push('/login');
});
</script>
