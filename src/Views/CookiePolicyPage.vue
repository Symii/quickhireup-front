<template>
  <div class="container mt-20">
    <header class="cookies-header text-center mb-4">
      <h1>Polityka plików cookies</h1>

      <p class="lead">
        Niniejsza polityka plików cookies wyjaśnia, czym są pliki cookies, w jaki sposób ich używamy
        oraz jakie masz prawa w związku z ich wykorzystaniem na stronie QuickHireUp.
      </p>
    </header>

    <section class="policy-section mb-4">
      <h2>1. Czym są pliki cookies?</h2>

      <p>
        Pliki cookies (ciasteczka) to niewielkie pliki tekstowe zapisywane na Twoim urządzeniu w
        momencie odwiedzenia strony internetowej. Zawierają one informacje niezbędne do poprawnego
        działania serwisu, ułatwiają jego obsługę i pomagają nam ulepszać jakość naszych usług.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>2. Jakie pliki cookies stosujemy?</h2>

      <ul>
        <li>
          <strong>Niezbędne cookies</strong> - umożliwiają korzystanie z podstawowych funkcji
          strony, takich jak logowanie, sesje użytkownika czy zapamiętywanie preferencji językowych.
        </li>

        <li>
          <strong>Analityczne cookies</strong> - pomagają nam analizować sposób korzystania z
          serwisu (np. liczba odwiedzin, czas spędzony na stronie), co pozwala ulepszać
          funkcjonalność platformy.
        </li>

        <li>
          <strong>Funkcjonalne cookies</strong> - zapamiętują Twoje ustawienia i personalizują
          doświadczenie użytkownika, np. wybrane filtry, motyw kolorystyczny, preferencje dotyczące
          ofert pracy.
        </li>

        <li>
          <strong>Marketingowe cookies</strong> - służą do wyświetlania reklam dostosowanych do
          Twoich zainteresowań oraz mierzenia skuteczności kampanii reklamowych.
        </li>
      </ul>
    </section>

    <section class="policy-section mb-4">
      <h2>3. Jak długo przechowujemy dane cookies?</h2>

      <p>
        Czas przechowywania plików cookies zależy od ich rodzaju. Cookies sesyjne są usuwane po
        zamknięciu przeglądarki, natomiast trwałe pozostają zapisane do momentu ich ręcznego
        usunięcia lub upływu terminu ważności wskazanego w ich parametrach.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>4. W jaki sposób możesz zarządzać plikami cookies?</h2>

      <p>
        Możesz w każdej chwili zmienić ustawienia dotyczące plików cookies w swojej przeglądarce.
        Większość przeglądarek umożliwia całkowite zablokowanie zapisu plików cookies lub
        informowanie o ich umieszczaniu. Pamiętaj jednak, że wyłączenie niektórych cookies może
        wpłynąć na prawidłowe działanie serwisu.
      </p>

      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647" target="_blank"
            >Instrukcja dla Google Chrome</a
          >
        </li>

        <li>
          <a href="https://support.mozilla.org/pl/kb/ciasteczka" target="_blank"
            >Instrukcja dla Mozilla Firefox</a
          >
        </li>

        <li>
          <a
            href="https://support.microsoft.com/pl-pl/help/17442/windows-internet-explorer-delete-manage-cookies"
            target="_blank"
            >Instrukcja dla Internet Explorer / Edge</a
          >
        </li>

        <li>
          <a href="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac" target="_blank"
            >Instrukcja dla Safari</a
          >
        </li>
      </ul>
    </section>

    <section class="policy-section mb-4">
      <h2>5. Cookies firm trzecich</h2>

      <p>
        Na stronie mogą być wykorzystywane pliki cookies dostarczone przez podmioty trzecie, takie
        jak Google (Google Analytics). Używamy ich, aby analizować ruch, optymalizować reklamy oraz
        monitorować skuteczność działań marketingowych. Każdy z tych podmiotów stosuje własną
        politykę prywatności:
      </p>

      <ul>
        <li>
          <a href="https://policies.google.com/privacy?hl=pl" target="_blank"
            >Polityka prywatności Google</a
          >
        </li>
      </ul>
    </section>

    <section class="policy-section mb-4">
      <h2>6. Zmiany w polityce cookies</h2>

      <p>
        Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce cookies. Wszelkie
        aktualizacje będą publikowane na tej stronie z odpowiednim wyprzedzeniem. Zalecamy regularne
        przeglądanie polityki, aby być na bieżąco z informacjami o tym, jak korzystamy z plików
        cookies.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>7. Kontakt</h2>

      <p>
        Jeśli masz pytania dotyczące naszej polityki plików cookies lub chcesz skorzystać ze swoich
        praw wynikających z RODO, skontaktuj się z nami pod adresem:

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

const contactEmail = ref('bok@quickhireup.pl');
const lastUpdated = ref('4 października 2025');
</script>

<style scoped>
.cookies-header {
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

.card {
  border-radius: 0.75rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.table thead th {
  background: rgba(0, 0, 0, 0.03);
}

.btn {
  border-radius: 0.6rem;
}

.mt-20 {
  margin-top: 20px;
}

ul {
  padding-left: 1.2rem;
}

ul li {
  margin-bottom: 0.5rem;
}

a,
a:hover {
  color: var(--primary);
  text-decoration: underline !important;
}

@media (max-width: 768px) {
  .cookies-header h1 {
    font-size: 1.75rem;
  }
}
</style>
