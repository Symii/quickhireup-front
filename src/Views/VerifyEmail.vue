<template>
  <div class="verify-container">
    <h2>Weryfikacja konta</h2>

    <p v-if="loading">Trwa weryfikacja...</p>

    <p v-else-if="success" class="success">Twoje konto zostało potwierdzone! Przekierowywanie...</p>

    <p v-else class="error">Błąd weryfikacji. Link może być nieprawidłowy lub wygasł.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/api/authentication/authStore';
import { useNotification } from '@/composables/useNotification';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const notification = useNotification();

const loading = ref(true);
const success = ref(false);

onMounted(async () => {
  const userId = route.query.userId as string;
  const token = route.query.token as string;

  if (!userId || !token) {
    loading.value = false;
    return;
  }

  try {
    await auth.verifyEmail(userId, token);
    success.value = true;
    notification.showMessage('Konto potwierdzone pomyślnie!');
    setTimeout(() => router.push('/login'), 3000);
  } catch {
    success.value = false;
    notification.showMessage('Nie udało się potwierdzić konta.', 'error');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.verify-container {
  text-align: center;
  margin-top: 50px;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
