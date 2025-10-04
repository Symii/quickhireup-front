<template>
  <div class="container mt-20">
    <header class="cookies-header text-center mb-4">
      <h1>Regulamin serwisu QuickHireUp</h1>

      <p class="lead">
        Niniejszy regulamin określa zasady korzystania z platformy QuickHireUp, dostępnej pod
        adresem quickhireup.pl. Prosimy o zapoznanie się z jego treścią przed rozpoczęciem
        korzystania z serwisu.
      </p>
    </header>

    <section class="policy-section mb-4">
      <h2>1. Definicje</h2>

      <p>
        <strong>Użytkownik</strong> - osoba fizyczna, która korzysta z platformy w celu znalezienia
        pracy lub dodania oferty zatrudnienia.

        <br />

        <strong>Administrator</strong> - właściciel serwisu QuickHireUp, odpowiedzialny za jego
        utrzymanie i rozwój.

        <br />

        <strong>Serwis</strong> - platforma internetowa dostępna pod adresem quickhireup.pl.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>2. Postanowienia ogólne</h2>

      <p>
        Korzystanie z serwisu jest równoznaczne z akceptacją niniejszego regulaminu. QuickHireUp
        świadczy usługi pośrednictwa pracy oraz umożliwia publikację ofert zatrudnienia i tworzenie
        profili zawodowych.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>3. Rejestracja i konto użytkownika</h2>

      <p>
        Aby w pełni korzystać z funkcjonalności platformy, użytkownik może utworzyć konto. Dane
        podawane podczas rejestracji muszą być prawdziwe i aktualne. Użytkownik ponosi
        odpowiedzialność za zachowanie poufności swojego hasła.
      </p>

      <p>
        Administrator ma prawo zablokować konto w przypadku naruszenia regulaminu lub działań
        niezgodnych z prawem.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>4. Zasady korzystania z serwisu</h2>

      <ul>
        <li>Użytkownik zobowiązuje się do korzystania z serwisu w sposób zgodny z prawem.</li>

        <li>
          Zabronione jest publikowanie treści obraźliwych, wprowadzających w błąd lub naruszających
          prawa osób trzecich.
        </li>

        <li>
          Użytkownik nie może podejmować działań mających na celu zakłócenie pracy serwisu lub
          uzyskanie nieautoryzowanego dostępu do danych.
        </li>
      </ul>
    </section>

    <section class="policy-section mb-4">
      <h2>5. Odpowiedzialność</h2>

      <p>
        Administrator nie ponosi odpowiedzialności za treści publikowane przez użytkowników ani za
        skutki decyzji podjętych na podstawie informacji zawartych w serwisie.
      </p>

      <p>
        QuickHireUp dokłada wszelkich starań, aby serwis działał bez przerw i błędów, jednak nie
        gwarantuje nieprzerwanej dostępności wszystkich funkcji.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>6. Reklamacje</h2>

      <p>
        Użytkownik ma prawo zgłosić reklamację dotyczącą działania serwisu w terminie 14 dni od
        wystąpienia problemu. Reklamacje należy przesyłać na adres:
        <a :href="`mailto:${contactEmail}`">
          {{ contactEmail }}
        </a>
      </p>

      <p>
        Reklamacje będą rozpatrywane w terminie 14 dni roboczych, a odpowiedź zostanie wysłana na
        adres e-mail użytkownika.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>7. Zmiany regulaminu</h2>

      <p>
        Administrator zastrzega sobie prawo do wprowadzania zmian w regulaminie. O wszelkich
        aktualizacjach użytkownicy zostaną poinformowani z odpowiednim wyprzedzeniem poprzez
        komunikat w serwisie.
      </p>
    </section>

    <section class="policy-section mb-4">
      <h2>8. Postanowienia końcowe</h2>

      <p>
        W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy Kodeksu
        cywilnego oraz inne obowiązujące przepisy prawa polskiego.
      </p>

      <p>
        Niniejszy regulamin obowiązuje od dnia <strong>{{ lastUpdated }}</strong> i pozostaje w mocy
        do czasu jego odwołania lub zmiany.
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

.mt-20 {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .cookies-header h1 {
    font-size: 1.75rem;
  }
}
</style>
