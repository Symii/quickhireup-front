<template>
  <header>
    <h1>
      <strong>{{ displayedNumber }}</strong> sprawdzonych ofert pracy
    </h1>
    <p>od najlepszych pracodawców</p>
  </header>

  <div class="search-form-container">
    <form class="search-form">
      <input type="text" placeholder="Stanowisko, firma, słowo kluczowe" />
      <select>
        <option>Kategoria</option>
      </select>
      <input type="text" placeholder="Lokalizacja" />
      <select>
        <option>Odległość +0 km</option>
        <option>Odległość +10 km</option>
        <option>Odległość +20 km</option>
        <option>Odległość +30 km</option>
        <option>Odległość +50 km</option>
        <option>Odległość +100 km</option>
      </select>
    </form>

    <button class="search-btn"><i class="fa-brands fa-searchengin"></i>&nbsp;Szukaj</button>
  </div>

  <div class="offers-section">
    <div class="offers-header">
      <h2>Strefa ofert</h2>
      <p>
        Klikaj w oferty, które Cię interesują. Dzięki temu wyświetlimy Ci lepiej dopasowane
        ogłoszenia.
      </p>
    </div>

    <div class="offers-grid">
      <div class="offer-card">
        <div class="super-offer">Superoferta</div>
        <h6>Kierownik Operacji i Sprzedaży</h6>
        <p>&nbsp;</p>
        <div class="company">
          <div>
            <img src="../assets/company.png" width="50px" />
          </div>
          <div>
            <p>Company Polska S.A.</p>
            <p>Mielec</p>
          </div>
        </div>
      </div>

      <div class="offer-card">
        <div class="super-offer">Superoferta</div>
        <h6>Starszy Sprzedawca-Kasjer</h6>
        <p>5 500 - 6 200 zł brutto / mies.</p>
        <div class="company">
          <div>
            <img src="../assets/company.png" width="50px" />
          </div>
          <div>
            <p>Company Polska S.A.</p>
            <p>Warszawa, Bemowo</p>
          </div>
        </div>
      </div>

      <div class="offer-card">
        <div class="super-offer">Superoferta</div>
        <h6>Kierownik Sklepu</h6>
        <p>7 800 - 9 350 zł brutto / mies.</p>
        <div class="company">
          <div>
            <img src="../assets/company.png" width="50px" />
          </div>
          <div>
            <p>Company Polska S.A.</p>
            <p>Warszawa</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const targetNumber = ref(Math.floor(Math.random() * (11000 - 10000 + 1)) + 10000);
const displayedNumber = ref(0);

function animateNumber() {
  const duration = 1000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    displayedNumber.value = Math.floor(progress * targetNumber.value);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

onMounted(() => {
  animateNumber();
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f8f9ff;
  margin: 0;
  padding: 0;
  color: #333;
}
header {
  background: white;
  padding: 2rem;
  text-align: center;
}
.search-btn {
  background-color: #ff5666;
  color: white;
  padding: 12px 36px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  border: none;
  margin-top: 10px;
}
header h1 {
  font-size: 2rem;
  color: #222;
}
.company {
  display: flex;
}
.offers-section {
  padding: 1rem;
  max-width: 1100px;
  margin: auto;
  margin-top: 20px;
}
.offers-header {
  text-align: center;
  margin-bottom: 1rem;
}
.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 40px;
}
.offer-card {
  background: white;
  font-size: 0.8rem;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}
.offer-card h3 {
  margin: 0 0 0.5rem;
}
.super-offer {
  background-color: #ffe481;
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 0.5rem;
  position: absolute;
  margin-top: -30px;
}

.search-form-container {
  max-width: 1000px;
  margin: auto;
  text-align: right;
}

.search-form {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fafaff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}

.search-form input,
.search-form select {
  border: none;
  padding: 15px;
  background-color: #fafaff;
  flex: 1;
  font-size: 14px;
  color: #555;
}

.search-form input::placeholder {
  color: #6c6c8c;
}

.search-form select {
  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg fill='%236c6c8c' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")
    no-repeat right 10px center;
  background-size: 16px 16px;
  padding-right: 30px;
  cursor: pointer;
  color: #6c6c8c;
}

.search-form > * {
  border-right: 1px solid #ccc;
}

.search-form > *:last-child {
  border-right: none;
}
</style>
