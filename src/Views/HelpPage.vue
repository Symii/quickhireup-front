<template>
  <section class="container py-5 help-page">
    <h1 class="text-center mb-4" :style="{ color: primaryColor }">Pomoc i FAQ</h1>

    <p class="lead text-center mb-5">
      Ta aplikacja umożliwia łatwe wystawianie ogłoszeń o pracę oraz aplikowanie na nie. Poniżej
      znajdziesz odpowiedzi na najczęściej zadawane pytania.
    </p>

    <b-tabs v-model="activeTab" class="mb-4" pills justified>
      <b-tab title="Ogólne" active>
        <FaqAccordion :items="faqGeneral" :primaryColor="primaryColor" />
      </b-tab>

      <b-tab title="Ogłoszenia">
        <FaqAccordion :items="faqPosts" :primaryColor="primaryColor" />
      </b-tab>

      <b-tab title="Aplikacje">
        <FaqAccordion :items="faqApplications" :primaryColor="primaryColor" />
      </b-tab>

      <b-tab title="Konto">
        <FaqAccordion :items="faqAccount" :primaryColor="primaryColor" />
      </b-tab>
    </b-tabs>

    <section class="contact-section mt-5 p-4 rounded shadow-sm bg-light">
      <h2 class="mb-3" :style="{ color: primaryColor }">Masz więcej pytań? Napisz do nas!</h2>
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="mb-3">
          <label for="name" class="form-label">Imię i nazwisko</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="contact.name"
            required
            :class="{ 'is-invalid': errors.name }"
          />
          <div class="invalid-feedback">Proszę podać swoje imię i nazwisko.</div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Adres e-mail</label>

          <input
            type="email"
            class="form-control"
            id="email"
            v-model="contact.email"
            required
            :class="{ 'is-invalid': errors.email }"
          />

          <div class="invalid-feedback">Proszę podać poprawny adres e-mail.</div>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">Wiadomość</label>
          <textarea
            class="form-control"
            id="message"
            rows="4"
            v-model="contact.message"
            required
            :class="{ 'is-invalid': errors.message }"
          ></textarea>

          <div class="invalid-feedback">Wiadomość nie może być pusta.</div>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :style="{ backgroundColor: primaryColor, borderColor: primaryColor }"
          :disabled="sending"
        >
          {{ sending ? 'Wysyłanie...' : 'Wyślij' }}
        </button>

        <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import FaqAccordion from '@/components/FaqAccordion.vue';

const primaryColor = '#ff5666';
const activeTab = ref(0);

const faqGeneral = [
  {
    question: 'Co to za aplikacja?',
    answer: 'To platforma do wystawiania i przeglądania ogłoszeń o pracę.',
  },
  {
    question: 'Czy aplikacja jest darmowa?',
    answer: 'Tak, korzystanie z aplikacji jest całkowicie darmowe.',
  },
];

const faqPosts = [
  {
    question: 'Jak dodać nowe ogłoszenie?',
    answer: 'Zaloguj się i przejdź do zakładki "Dodaj ogłoszenie". Wypełnij formularz i zatwierdź.',
  },
  {
    question: 'Czy mogę usuwać moje ogłoszenia?',
    answer: 'Tak, w zakładce "Moje ogłoszenia" możesz usuwać i edytować swoje ogłoszenia.',
  },
];

const faqApplications = [
  {
    question: 'Jak aplikować na ogłoszenie?',
    answer:
      'Kliknij na ogłoszenie i naciśnij przycisk "Aplikuj". Następnie wypełnij formularz aplikacji.',
  },
  {
    question: 'Czy otrzymam powiadomienie o statusie mojej aplikacji?',
    answer: 'Tak, system wysyła powiadomienia e-mailowe dotyczące statusu aplikacji.',
  },
];

const faqAccount = [
  {
    question: 'Czy muszę mieć konto, aby aplikować?',
    answer: 'Tak, rejestracja i logowanie są wymagane do aplikowania na ogłoszenia.',
  },
  {
    question: 'Jak odzyskać zapomniane hasło?',
    answer: 'Skorzystaj z opcji "Zapomniałem hasła" na stronie logowania, aby zresetować hasło.',
  },
];

const contact = reactive({
  name: '',
  email: '',
  message: '',
});

const errors = reactive({
  name: false,
  email: false,
  message: false,
});

const sending = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateForm() {
  errors.name = !contact.name.trim();
  errors.email = !validateEmail(contact.email);
  errors.message = !contact.message.trim();
  return !errors.name && !errors.email && !errors.message;
}

async function handleSubmit() {
  if (!validateForm()) return;

  sending.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    successMessage.value = 'Dziękujemy za wiadomość! Odezwiemy się wkrótce.';
    contact.name = '';
    contact.email = '';
    contact.message = '';
  } catch {
    errorMessage.value = 'Coś poszło nie tak. Spróbuj ponownie później.';
  } finally {
    sending.value = false;
  }
}
</script>

<style scoped>
.help-page {
  max-width: 900px;
  margin: 0 auto;
}

:root {
  --bs-primary: #ff5666;
}

.contact-section {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  padding: 30px 35px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(255, 86, 102, 0.2);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.contact-section h2 {
  font-weight: 700;
  margin-bottom: 25px;
  letter-spacing: 0.04em;
}

.form-label {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  display: block;
  transition: color 0.3s ease;
}

input.form-control,
textarea.form-control {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: none;
  outline: none;
  resize: vertical;
}

input.form-control:focus,
textarea.form-control:focus {
  border-color: #ff5666;
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.3);
}

input.is-invalid,
textarea.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.3);
}

.invalid-feedback {
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 6px;
}

button.btn-primary {
  background-color: #ff5666;
  border-color: #ff5666;
  font-weight: 600;
  padding: 12px 28px;
  font-size: 1.1rem;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 86, 102, 0.35);
  cursor: pointer;
  user-select: none;
}

button.btn-primary:hover:not(:disabled),
button.btn-primary:focus:not(:disabled) {
  background-color: #e14b59;
  border-color: #e14b59;
  box-shadow: 0 6px 20px rgba(225, 75, 89, 0.6);
  outline: none;
}

button.btn-primary:disabled {
  background-color: #ffb3b8;
  border-color: #ffb3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.alert {
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
}
</style>
