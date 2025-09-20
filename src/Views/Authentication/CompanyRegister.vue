<template>
  <div class="register-wrapper">
    <div class="register-card">
      <h1 class="title">Rejestracja dla Firm</h1>

      <p class="subtitle">Utwórz konto firmowe, aby wystawiać ogłoszenia o pracę</p>

      <form @submit.prevent="submitCompanyRegister" class="register-form" novalidate>
        <div class="input-group">
          <label for="companyName">Nazwa firmy</label>

          <input id="companyName" type="text" v-model="companyName" required />
        </div>

        <div class="input-group">
          <label for="nip">NIP</label>

          <input id="nip" type="text" v-model="nip" required />
        </div>

        <div class="input-group">
          <label for="email">Email kontaktowy</label>

          <input id="email" type="email" v-model="email" required />
        </div>

        <div class="input-group">
          <label for="password">Hasło</label>

          <input id="password" type="password" v-model="password" required />
        </div>

        <div class="input-group">
          <label for="confirmPassword">Potwierdź hasło</label>

          <input id="confirmPassword" type="password" v-model="confirmPassword" required />
        </div>

        <button type="submit" :disabled="!isFormValid" class="btn-register">
          Zarejestruj firmę
        </button>
      </form>

      <p class="footer-text">
        Masz już konto firmowe?

        <RouterLink to="/login">
          <span class="login-link">Zaloguj się</span>
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const companyName = ref('');
const nip = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const isNipValid = (nip: string) => {
  const cleanNip = nip.replace(/[\s-]/g, '');
  return /^[0-9]{10}$/.test(cleanNip);
};

const isEmailValid = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isFormValid = computed(() => {
  return (
    companyName.value.trim().length >= 2 &&
    isNipValid(nip.value) &&
    isEmailValid(email.value) &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value
  );
});

function submitCompanyRegister() {
  alert(`Firma: ${companyName.value}\nNIP: ${nip.value}\nEmail: ${email.value}`);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap');

.register-wrapper {
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

.register-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 20px 40px rgba(181, 101, 118, 0.4);
  padding: 3rem 3.5rem;
  max-width: 440px;
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

.register-form {
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

.btn-register {
  background: rgb(255, 86, 102);
  color: white;
  font-weight: 600;
  padding: 1rem 0;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(181, 101, 118, 0.4);
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.btn-register:hover:not(:disabled) {
  background: rgb(255, 86, 102);
  box-shadow: 0 8px 20px rgba(255, 86, 102, 0.6);
}

.btn-register:disabled {
  background: #c3c3c3;
  cursor: not-allowed;
  box-shadow: none;
}

.footer-text {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #777;
}

.login-link {
  color: rgb(255, 86, 102);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: rgba(255, 86, 102, 0.9);
}

@media (max-width: 450px) {
  .register-card {
    padding: 2rem 2rem;
  }
  .title {
    font-size: 2rem;
  }
}
</style>
