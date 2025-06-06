<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="title">Zaloguj się</h1>

      <p class="subtitle">Dostęp do serwisu QuickHireUp</p>

      <form @submit.prevent="submitLogin" class="login-form" novalidate>
        <div class="input-group">
          <label for="email">Email</label>

          <input id="email" type="email" v-model="email" autocomplete="email" required />
        </div>

        <div class="input-group">
          <label for="password">Hasło</label>

          <input
            id="password"
            type="password"
            v-model="password"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" :disabled="!isFormValid || loading" class="btn-login">
          {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
        </button>

        <p v-if="error" style="color: red" aria-live="polite">{{ error }}</p>
      </form>

      <p class="footer-text">
        Nie masz konta?

        <RouterLink to="/register">
          <span class="register-link">Zarejestruj się</span>
        </RouterLink>

        <br />

        Jesteś firmą?

        <RouterLink to="/company-register">
          <span class="register-link">Załóż konto firmowe</span>
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useNotification } from '@/composables/useNotification';

const notification = useNotification();
const router = useRouter();
const { login, error, loading, isLoggedIn } = useAuth();

const email = ref('');
const password = ref('');

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isFormValid = computed(() => isEmailValid(email.value) && password.value.length >= 6);

onMounted(() => {
  if (isLoggedIn.value) {
    notification.showMessage('Jesteś już zalogowany.');
    router.push('/');
  }
});

async function submitLogin() {
  try {
    await login({ email: email.value, password: password.value });
    router.push('/');
  } catch {}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap');

.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../../assets/laptop-with-pen-pencil-paper-clips-sticky-notes-spiral-notepad-beige-background.jpg');
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
</style>
