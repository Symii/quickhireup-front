<template>
  <div class="verify-wrapper">
    <div class="verify-card">
      <div v-if="loading" class="status-content">
        <div class="spinner"></div>

        <h2>Weryfikacja zmiany adresu e-mail</h2>

        <p>Proszę czekać, sprawdzamy Twój token...</p>
      </div>

      <div v-else-if="success" class="status-content success">
        <div class="icon-circle success-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path :d="mdiCheckCircle" fill="#10b981" />
          </svg>
        </div>

        <h2>Sukces!</h2>

        <p>Twój adres e-mail został pomyślnie zaktualizowany.</p>

        <p class="redirect-info">Za chwilę zostaniesz przekierowany do logowania...</p>
      </div>

      <div v-else class="status-content error">
        <div class="icon-circle error-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path :d="mdiMessageAlert" fill="#fc4c4e" />
          </svg>
        </div>

        <h2>Wystąpił błąd</h2>

        <p>Link weryfikacyjny jest nieprawidłowy lub wygasł.</p>

        <button @click="goToHome" class="btn-generator">Wróć do strony głównej</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/api/authentication/authStore';
import { useNotification } from '@/composables/useNotification';
import { mdiCheckCircle, mdiMessageAlert } from '@mdi/js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const notification = useNotification();

const loading = ref(true);
const success = ref(false);

const goToHome = () => router.push('/');

onMounted(async () => {
  const userId = route.query.userId as string;
  const token = route.query.token as string;
  const newEmail = route.query.newEmail as string;

  if (!userId || !token || !newEmail) {
    loading.value = false;
    success.value = false;
    notification.showMessage('Link jest niekompletny.', 'error');
    return;
  }

  try {
    await auth.confirmEmailChange(userId, token, newEmail);

    success.value = true;
    notification.showMessage('Adres e-mail został zmieniony!');

    setTimeout(() => {
      auth.logout();
      router.push('/login');
    }, 3500);
  } catch {
    success.value = false;
    notification.showMessage('Weryfikacja nie powiodła się.', 'error');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.verify-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.verify-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  max-width: 450px;
  width: 100%;
  text-align: center;
  transition: transform 0.3s ease;
}

.verify-card h2 {
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
}

.verify-card p {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
}

.success-icon {
  background-color: #d1fae5;
  color: #10b981;
}

.error-icon {
  background-color: #fee2e2;
  color: #ef4444;
}

.icon-circle svg {
  width: 40px;
  height: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.redirect-info {
  font-size: 0.875rem !important;
  color: #9ca3af !important;
  margin-top: 10px;
}

.btn-generator {
  background: var(--primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 600;
  transition: opacity 0.3s;
  cursor: pointer;
  display: inline-block;
}

.btn-generator:hover {
  opacity: 0.9;
  color: white;
}
</style>
