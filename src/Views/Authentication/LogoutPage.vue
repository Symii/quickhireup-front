<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/api/authentication/authStore';
import { useNotification } from '@/composables/useNotification';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();
const notification = useNotification();

auth.logout();
notification.showMessage('Pomyślnie wylogowano', 'info');

router.push('/');
</script>
