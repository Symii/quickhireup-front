<template>
  <div class="container mt-20">
    <header class="privacy-header text-center mb-4">
      <h1>Polityka prywatności</h1>

      <p class="lead">
        Niniejsza Polityka prywatności określa zasady przetwarzania i ochrony danych osobowych
        użytkowników korzystających ze strony QuickHireUp. Zależy nam na transparentności i
        bezpieczeństwie Twoich danych.
      </p>
    </header>

    <section class="policy-section mb-4">
      <h2>1. Administrator danych</h2>

      <p>
        Administratorem Twoich danych osobowych jest firma <strong>QuickHireUp Sp. z o.o.</strong>,
        z siedzibą w Słupsku, przy ul. Krzysztofa Arciszewskiego 22A, 76-200 Słupsk, NIP:
        000-000-00-00. Kontakt z administratorem jest możliwy pod adresem e-mail:

        <a :href="`mailto:${contactEmail}`">
          {{ contactEmail }}
        </a>
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>2. Jakie dane przetwarzamy?</h2>

      <p>
        W ramach korzystania z serwisu QuickHireUp możemy przetwarzać następujące kategorie danych
        osobowych:
      </p>

      <ul>
        <li>
          Imię i nazwisko, adres e-mail, numer telefonu — w przypadku kontaktu lub rejestracji.
        </li>

        <li>
          Dane dotyczące logowania — adres IP, identyfikator urządzenia, przeglądarka, system
          operacyjny.
        </li>

        <li>
          Dane dotyczące korzystania z platformy — odwiedzane strony, aktywność w serwisie,
          kliknięcia.
        </li>

        <li>
          Dane z plików cookies — zgodnie z naszą

          <RouterLink to="/polityka-plikow-cookies"> Polityką plików cookies </RouterLink>
        </li>
      </ul>
    </section>

    <section class="policy-section mb-4">
      <h2>4. Podstawa prawna przetwarzania</h2>

      <ul>
        <li>Twoja zgoda (art. 6 ust. 1 lit. a RODO) - np. zapisy do newslettera.</li>

        <li>Niezbędność do wykonania umowy (art. 6 ust. 1 lit. b RODO).</li>

        <li>Obowiązek prawny (art. 6 ust. 1 lit. c RODO).</li>

        <li>Prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).</li>
      </ul>
    </section>

    <section class="policy-section mb-4">
      <h2>5. Komu udostępniamy Twoje dane?</h2>

      <p>
        Dane osobowe mogą być przekazywane zaufanym partnerom technologicznym, takim jak dostawcy
        usług hostingowych, firmom obsługującym płatności lub partnerom rekrutacyjnym. Wszyscy
        odbiorcy danych są zobowiązani do zachowania poufności i ochrony danych zgodnie z RODO.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>6. Okres przechowywania danych</h2>

      <p>
        Dane osobowe będą przechowywane przez okres niezbędny do realizacji celów, dla których
        zostały zebrane, a następnie przez czas wymagany przepisami prawa lub do momentu cofnięcia
        zgody.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>7. Twoje prawa</h2>

      <p>Masz prawo do:</p>

      <ul>
        <li>dostępu do swoich danych i otrzymania ich kopii,</li>

        <li>sprostowania (poprawienia) danych,</li>

        <li>usunięcia danych („prawo do bycia zapomnianym”),</li>

        <li>ograniczenia przetwarzania danych,</li>

        <li>przenoszenia danych,</li>

        <li>wniesienia sprzeciwu wobec przetwarzania danych,</li>

        <li>cofnięcia zgody w dowolnym momencie.</li>
      </ul>
      <p>
        Aby skorzystać z powyższych praw, skontaktuj się z nami poprzez e-mail:

        <a :href="`mailto:${contactEmail}`">
          {{ contactEmail }}
        </a>
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>8. Bezpieczeństwo danych</h2>

      <p>
        QuickHireUp stosuje odpowiednie środki techniczne i organizacyjne, aby chronić dane osobowe
        przed nieautoryzowanym dostępem, utratą lub zniszczeniem. Regularnie aktualizujemy nasze
        procedury bezpieczeństwa, aby zapewnić maksymalną ochronę Twoich danych.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>9. Zmiany w polityce prywatności</h2>

      <p>
        Polityka prywatności może być okresowo aktualizowana, aby odzwierciedlać zmiany w przepisach
        lub naszej działalności. Wszelkie aktualizacje będą publikowane na tej stronie.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>10. Kontakt</h2>

      <p>
        W przypadku pytań dotyczących ochrony danych osobowych lub realizacji praw użytkownika,
        prosimy o kontakt pod adresem:

        <a :href="`mailto:${contactEmail}`">
          {{ contactEmail }}
        </a>
      </p>
    </section>
  </div>

  <footer class="text-center mt-4">
    <p class="small text-muted">Ostatnia aktualizacja: {{ lastUpdated }}</p>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const contactEmail = ref('bok@quickhireup.pl');
const lastUpdated = ref('4 października 2025');
</script>

<style scoped>
.privacy-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 2.5rem 1rem;
  border-radius: 0.75rem;
}

.lead {
  max-width: 720px;
  margin: 0.5rem auto 0 auto;
}

.policy-section h2 {
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.mt-20 {
  margin-top: 20px;
}

a,
a:hover {
  color: var(--primary);
  text-decoration: underline !important;
}

ul {
  padding-left: 1.2rem;
}

ul li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .privacy-header h1 {
    font-size: 1.75rem;
  }
}
</style>
