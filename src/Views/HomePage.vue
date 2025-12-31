<template>
  <header>
    <h1>Oferty pracy</h1>

    <p>
      Znaleźliśmy <strong>{{ formatNumber(displayedNumber) }}</strong> ofert pracy w twojej okolicy.
    </p>
  </header>

  <div class="search-form-container">
    <form class="search-form">
      <input type="text" v-model="keyword" placeholder="Stanowisko, firma, słowo kluczowe" />

      <select v-model="type">
        <option value="">Rodzaj pracy</option>

        <option>Pełny etat</option>

        <option>Część etatu</option>

        <option>Zdalnie</option>

        <option>Hybrydowo</option>
      </select>

      <LocationAutocomplete v-model="location" placeholder="np. Warszawa" />

      <select v-model="distance">
        <option value="">+0 km</option>

        <option value="10">+10 km</option>

        <option value="20">+20 km</option>

        <option value="30">+30 km</option>

        <option value="50">+50 km</option>

        <option value="100">+100 km</option>
      </select>
    </form>

    <button class="search-btn" @click="search">
      <i class="fa-brands fa-searchengin"></i> Szukaj
    </button>
  </div>

  <div class="job-board container py-5">
    <h1 class="text-center display-4 fw-bold mb-5 text-primary-gradient">Najnowsze Oferty Pracy</h1>

    <div class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="job in jobs" :key="job.id">
        <div
          class="card job-card h-100 shadow-sm border-0"
          :class="{ 'is-promoted': job.isPromoted }"
        >
          <div class="card-body d-flex flex-column">
            <div v-if="job.isPromoted" class="promoted-badge">
              <i class="fas fa-star me-1"></i> Super oferta
            </div>

            <br v-if="job.isPromoted" />

            <div class="d-flex align-items-center mb-3">
              <div class="company-icon me-3" :class="{ 'pro-icon': job.isPromoted }">
                {{ job.company[0].toUpperCase() }}
              </div>

              <div>
                <h5 class="card-title mb-0 fw-semibold">{{ job.jobTitle }}</h5>

                <small class="text-muted">{{ job.company }}</small>
              </div>
            </div>

            <p class="card-text text-muted flex-grow-1">
              {{ job.salaryFrom }} - {{ job.salaryTo }} PLN
            </p>

            <div class="d-flex justify-content-between text-muted small mb-3">
              <span><i class="fa-regular fa-map me-1"></i>{{ job.location }}</span>

              <span><i class="fas fa-clock me-1"></i>{{ job.contractType }}</span>
            </div>

            <RouterLink :to="`/oferta/${job.id}`">
              <button class="btn btn-gradient w-100 mt-auto">
                <i class="fa-regular fa-circle-right me-2"></i>Zobacz ofertę
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="promo-generator">
    <div class="promo-content">
      <img src="https://cdn-icons-png.flaticon.com/512/2920/2920263.png" alt="Generator" />
      <div>
        <h2>Stwórz idealny opis stanowiska w kilka sekund</h2>

        <p>
          Nie trać czasu - skorzystaj z naszego inteligentnego narzędzia do generowania opisów ofert
          pracy i przyciągaj najlepszych kandydatów!
        </p>

        <RouterLink to="/generator">
          <button class="btn-generator">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path :d="mdiRocketLaunch" fill="white" />
            </svg>

            Uruchom generator
          </button>
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="partners-slider">
    <div class="container mb-4">
      <h2 class="text-center mt-4 mb-4">Nasi Partnerzy</h2>

      <PartnersSlide />
    </div>
  </section>
</template>

<script setup lang="ts">
import jobOfferService from '@/api/services/jobOfferService';
import type { JobOffer } from '@/api/types/jobOffer';
import { ref, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import PartnersSlide from './Components/PartnersSlide.vue';
import LocationAutocomplete from '@/components/LocationAutocomplete.vue';
import { mdiRocketLaunch } from '@mdi/js';

const router = useRouter();

const search = () => {
  router.push({
    path: '/oferty',
    query: {
      keyword: keyword.value,
      type: type.value,
      location: location.value,
      distance: distance.value,
    },
  });
};

const keyword = ref('');
const type = ref('');
const location = ref('');
const distance = ref('');

const displayedNumber = ref(0);

function formatNumber(num: number) {
  return num.toLocaleString('pl-PL');
}

function animateNumber(targetNumber: number) {
  const duration = 1500;
  const start = performance.now();
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    displayedNumber.value = Math.floor(easeOut(progress) * targetNumber);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const jobs = ref<Array<JobOffer> | null>(null);

onMounted(async () => {
  jobs.value = await jobOfferService.getRandom(6);
  const targetNumber = await jobOfferService.getTotalCount();
  animateNumber(targetNumber);
});
</script>

<style scoped>
body {
  font-family: 'Inter', Arial, sans-serif;
  background: var(--bg-light);
  color: var(--text);
  margin: 0;
  padding: 0;
}

header {
  background: var(--bg-light);
  padding: 2rem 1rem;
  text-align: center;
}

header h1 {
  font-size: 2.25rem;
  color: var(--text);
}

header p {
  color: var(--text-muted);
  font-size: 1rem;
  margin-top: 0.5rem;
}

.search-form-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
}

.promo-generator {
  background: var(--bg-light);
  padding: 2.5rem 1.5rem;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.promo-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

.promo-content img {
  width: 160px;
  height: auto;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.promo-content div {
  max-width: 600px;
}

.promo-content h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.promo-content p {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .promo-content {
    flex-direction: column;
    text-align: center;
  }

  .promo-content img {
    width: 120px;
  }

  .promo-content h2 {
    font-size: 1.5rem;
  }
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--bg-light);
  box-shadow: var(--shadow-sm);
}

.search-form input,
.search-form select {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background-color: var(--bg);
  font-size: 0.95rem;
  color: var(--text);

  box-sizing: border-box;
  height: 3rem;
  appearance: none;
  -webkit-appearance: none;
  line-height: 1.5;
}

.search-form input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  box-shadow: var(--shadow-md);
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  margin-top: 1rem;
}

.search-btn:hover {
  background-color: #e63a3c;
  transform: scale(1.03);
}

.job-board {
  background-color: var(--bg-light);
}

.job-board h1 {
  font-size: 2rem;
  background: var(--primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
}

.job-card {
  background: var(--card);
  border-radius: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.job-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.card-body {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.company-icon {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: bold;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.card-title {
  font-size: 1.125rem;
  margin: 0;
}

.card-text {
  font-size: 0.95rem;
  margin: 1rem 0;
  color: var(--text-muted);
  flex-grow: 1;
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-btn {
    width: 100%;
  }

  .company-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  header h1 {
    font-size: 1.5rem;
  }
}

.job-card.is-promoted {
  background: linear-gradient(to bottom right, #ffffff, #fffdf0);
  border: 1px solid rgba(255, 193, 7, 0.3) !important;
  position: relative;
  overflow: hidden;
}

.job-card.is-promoted:hover {
  box-shadow: 0 10px 20px rgba(255, 193, 7, 0.2) !important;
  transform: translateY(-8px);
}

.promoted-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(45deg, #ffc107, #ff9800);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.company-icon.pro-icon {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

.job-card.is-promoted::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-25deg);
  animation: shine 6s infinite;
}
</style>
