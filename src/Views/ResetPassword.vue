<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="title">{{ isResetting ? 'Nowe hasło' : 'Resetuj hasło' }}</h1>

      <p class="subtitle">
        {{ isResetting ? 'Wprowadź nowe dane logowania' : 'Podaj email, aby otrzymać link' }}
      </p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="!isResetting" class="input-group">
          <label for="email">Email</label>

          <input id="email" type="email" v-model="form.email" required />
        </div>

        <template v-else>
          <div class="input-group">
            <label for="password">Nowe hasło</label>

            <input id="password" type="password" v-model="form.password" required />
          </div>

          <div class="input-group">
            <label for="confirm">Potwierdź nowe hasło</label>

            <input id="confirm" type="password" v-model="form.confirmPassword" required />
          </div>
        </template>

        <button type="submit" :disabled="loading || !isFormValid" class="btn-login">
          <span v-if="loading" class="pulse-loader"></span>
          <span v-else>{{ isResetting ? 'Zmień hasło' : 'Wyślij link' }}</span>
        </button>

        <div v-if="statusMessage" :class="['status-msg', isError ? 'error' : 'success']">
          {{ statusMessage }}
        </div>
      </form>

      <p class="footer-text">
        Pamiętasz hasło?

        <RouterLink to="/login" class="register-link">Zaloguj się</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import api from '@/api/services/api';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/api/interfaces/ApiErrorResponse';

const route = useRoute();
const router = useRouter();
const notification = useNotification();

const loading = ref(false);
const statusMessage = ref('');
const isError = ref(false);
const isResetting = ref(false);

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  token: '',
});

onMounted(() => {
  if (route.query.token && route.query.email) {
    isResetting.value = true;
    form.token = route.query.token as string;
    form.email = route.query.email as string;
  }
});

const isFormValid = computed(() => {
  if (!isResetting.value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  }

  return form.password.length >= 6 && form.password === form.confirmPassword;
});

async function handleSubmit() {
  loading.value = true;
  statusMessage.value = '';

  try {
    if (!isResetting.value) {
      await api.post('/account/forgot-password', { email: form.email });
      notification.showMessage('Instrukcje zostały wysłane na e-mail.');
      statusMessage.value = 'Sprawdź swoją skrzynkę pocztową.';
    } else {
      await api.post('/account/reset-password', {
        email: form.email,
        token: form.token,
        newPassword: form.password,
      });

      notification.showMessage('Hasło zostało zmienione pomyślnie!');
      await router.push('/login');
    }
  } catch (err: unknown) {
    isError.value = true;

    const axiosError = err as AxiosError<ApiErrorResponse>;

    const errorMessage = axiosError.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie.';

    notification.showMessage(errorMessage, 'error');
    statusMessage.value = errorMessage;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap');

.status-msg {
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}
.status-msg.success {
  background: #e8f5e9;
  color: #2e7d32;
}
.status-msg.error {
  background: #ffebee;
  color: #c62828;
}

.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../assets/laptop-with-pen-pencil-paper-clips-sticky-notes-spiral-notepad-beige-background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-family: 'Poppins', sans-serif;
  padding: 1rem;
}

.login-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 20px 40px rgba(255, 86, 102, 0.4);
  padding: 3rem 3.5rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.title {
  font-size: 2.4rem;
  font-weight: 700;
  color: rgb(255, 86, 102);
  margin-bottom: 0.4rem;
}

.subtitle {
  font-weight: 300;
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #7e7e7e;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.input-group label {
  font-weight: 500;
  color: #4a4a4a;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-group input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #d3d3d3;
  border-radius: 0.6rem;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  outline: none;
}

.input-group input:focus {
  border-color: rgb(255, 86, 102);
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.5);
}

.btn-login {
  background: rgb(255, 86, 102);
  color: white;
  font-weight: 600;
  padding: 1rem 0;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(255, 86, 102, 0.4);
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
}

.btn-login:hover:not(:disabled) {
  background: rgb(255, 86, 102);
  box-shadow: 0 8px 20px rgba(255, 86, 102, 0.6);
}

.btn-login:disabled {
  background: #c3c3c3;
  cursor: not-allowed;
  box-shadow: none;
}

.footer-text {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #777;
}

.register-link {
  color: rgb(255, 86, 102);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: rgba(255, 86, 102, 0.8);
}

@media (max-width: 450px) {
  .login-card {
    padding: 2rem 2rem;
  }
  .title {
    font-size: 2rem;
  }
}

.pulse-loader {
  position: relative;
  width: 14px;
  height: 14px;
  background: rgb(255, 86, 102);
  border-radius: 50%;
  animation: pulse-center 1.6s infinite ease-in-out;
}

.pulse-loader::before,
.pulse-loader::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 86, 102, 0.4);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0;
}

.pulse-loader::before {
  animation: pulse-wave 1.6s infinite ease-out;
}

.pulse-loader::after {
  animation: pulse-wave 1.6s infinite ease-out;
  animation-delay: 0.8s;
}

.pulse-loader::after {
  box-shadow: 0 0 0 0 rgba(255, 86, 102, 0.25);
}

@keyframes pulse-center {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes pulse-wave {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  80% {
    opacity: 0.15;
  }
  100% {
    transform: translate(-50%, -50%) scale(3.5);
    opacity: 0;
  }
}

.btn-outline-primary {
  width: 100%;
  height: 65px;
  color: #ff5666;
  border-color: #ff5666;
}
.btn-outline-primary:hover {
  background-color: #ff5666;
  color: white !important;
}
</style>
