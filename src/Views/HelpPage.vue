<template>
  <section class="container py-5 help-page">
    <header class="help-header text-center mb-5">
      <h1>Pomoc i FAQ</h1>

      <p class="lead">
        Ta aplikacja umożliwia łatwe wystawianie ogłoszeń o pracę oraz aplikowanie na nie. Poniżej
        znajdziesz odpowiedzi na najczęściej zadawane pytania.
      </p>
    </header>

    <b-tabs v-model="activeTab" class="mb-4" pills justified>
      <b-tab title="Ogólne" active>
        <div class="faq-list">
          <FaqCard
            v-for="(item, index) in faqGeneral"
            :key="index"
            :item="item"
            :primaryColor="primaryColor"
          />
        </div>
      </b-tab>

      <b-tab title="Ogłoszenia">
        <div class="faq-list">
          <FaqCard
            v-for="(item, index) in faqPosts"
            :key="index"
            :item="item"
            :primaryColor="primaryColor"
          />
        </div>
      </b-tab>

      <b-tab title="Aplikacje">
        <div class="faq-list">
          <FaqCard
            v-for="(item, index) in faqApplications"
            :key="index"
            :item="item"
            :primaryColor="primaryColor"
          />
        </div>
      </b-tab>

      <b-tab title="Konto">
        <div class="faq-list">
          <FaqCard
            v-for="(item, index) in faqAccount"
            :key="index"
            :item="item"
            :primaryColor="primaryColor"
          />
        </div>
      </b-tab>
    </b-tabs>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FaqCard from '@/components/FaqCard.vue';

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
</script>

<style scoped>
.help-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 3rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.help-header h1 {
  font-weight: 700;
  margin-bottom: 1rem;
}

.faq-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
