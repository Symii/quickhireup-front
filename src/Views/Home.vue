<template>
  <header>
    <h1>Oferty pracy</h1>

    <p>
      Znaleźliśmy <strong>{{ formatNumber(displayedNumber) }}</strong> ofert pracy w twojej okolicy.
    </p>
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

  <div class="job-board container py-5">
    <h1 class="text-center display-4 fw-bold mb-5 text-primary-gradient">Najnowsze Oferty Pracy</h1>

    <div class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="job in jobs" :key="job.id">
        <div class="card job-card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center mb-3">
              <div class="company-icon me-3">{{ job.company[0] }}</div>

              <div>
                <h5 class="card-title mb-0 fw-semibold">{{ job.title }}</h5>

                <small class="text-muted">{{ job.company }}</small>
              </div>
            </div>

            <p class="card-text text-muted flex-grow-1">{{ job.description }}</p>

            <div class="d-flex justify-content-between text-muted small mb-3">
              <span><i class="fa-regular fa-map me-1"></i>{{ job.location }}</span>

              <span><i class="fas fa-clock me-1"></i>{{ job.type }}</span>
            </div>

            <a href="#" class="btn btn-gradient w-100 mt-auto">
              <i class="fa-regular fa-circle-right me-2"></i>Zobacz ofertę
            </a>
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
          Nie trać czasu – skorzystaj z naszego inteligentnego narzędzia do generowania opisów ofert
          pracy i przyciągaj najlepszych kandydatów!
        </p>

        <a href="/generator" class="btn-generator">🚀 Uruchom generator</a>
      </div>
    </div>
  </section>

  <section class="partners-slider">
    <div class="container">
      <h2 class="text-center mb-4">Nasi Partnerzy</h2>

      <div class="partners-track" ref="track">
        <div
          class="partner"
          v-for="(partner, index) in partners.concat(partners)"
          :key="index + '-' + partner.name"
        >
          <img :src="partner.logo" :alt="partner.name" />

          <h3 class="partner-name">{{ partner.name }}</h3>

          <p>{{ partner.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const targetNumber = ref(Math.floor(Math.random() * (11000 - 10000 + 1)) + 10000);
const displayedNumber = ref(0);

function formatNumber(num) {
  return num.toLocaleString('pl-PL');
}

function animateNumber() {
  const duration = 1500;
  const start = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    displayedNumber.value = Math.floor(easeOut(progress) * targetNumber.value);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

onMounted(() => {
  animateNumber();
});

const jobs = ref([
  {
    id: 1,
    title: 'Frontend Developer (Vue.js)',
    company: 'TechNova',
    location: 'Warszawa, Polska',
    type: 'Pełny etat',
    description:
      'Buduj nowoczesne aplikacje SPA z Vue 3 i Tailwind CSS. Dołącz do zgranego zespołu frontendowego!',
  },
  {
    id: 2,
    title: 'Backend Developer (Node.js)',
    company: 'CodeWave',
    location: 'Zdalnie',
    type: 'Pełny etat',
    description:
      'Twórz szybkie i bezpieczne API w Node.js, z użyciem NestJS, PostgreSQL i Dockera.',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'Kraków, Polska',
    type: 'Część etatu',
    description:
      'Projektuj intuicyjne i piękne interfejsy w Figma. Szukamy osoby z pasją do detalu.',
  },
  {
    id: 4,
    title: 'Fullstack Developer',
    company: 'WebCraft',
    location: 'Wrocław, Polska',
    type: 'Pełny etat',
    description: 'Pracuj z React i Node.js nad skalowalnymi rozwiązaniami e-commerce.',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudSolutions',
    location: 'Zdalnie',
    type: 'Pełny etat',
    description: 'Zarządzaj infrastrukturą w chmurze AWS i automatyzuj procesy CI/CD.',
  },
  {
    id: 6,
    title: 'Data Scientist',
    company: 'DataMinds',
    location: 'Poznań, Polska',
    type: 'Pełny etat',
    description: 'Analizuj dane i twórz modele predykcyjne z użyciem Python i ML.',
  },
  {
    id: 7,
    title: 'Mobile Developer (iOS)',
    company: 'AppVentures',
    location: 'Gdańsk, Polska',
    type: 'Pełny etat',
    description: 'Twórz aplikacje mobilne dla iOS z użyciem Swift i SwiftUI.',
  },
  {
    id: 8,
    title: 'QA Engineer',
    company: 'SoftCheck',
    location: 'Łódź, Polska',
    type: 'Pełny etat',
    description: 'Testuj oprogramowanie automatycznie i manualnie, dbaj o jakość produktów.',
  },
  {
    id: 9,
    title: 'Product Manager',
    company: 'InnoTech',
    location: 'Warszawa, Polska',
    type: 'Pełny etat',
    description: 'Kieruj rozwojem produktu, współpracuj z zespołami IT i marketingu.',
  },
]);

const partners = ref([
  {
    name: 'WorkPro',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    description: 'Lider wśród agencji rekrutacyjnych IT.',
  },
  {
    name: 'HireNow',
    logo: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
    description: 'Innowacyjne podejście do zatrudniania.',
  },
  {
    name: 'DevTalent',
    logo: 'https://cdn-icons-png.flaticon.com/512/921/921347.png',
    description: 'Specjalizacja w rekrutacji programistów.',
  },
  {
    name: 'PeopleFirst',
    logo: 'https://cdn-icons-png.flaticon.com/512/2972/2972558.png',
    description: 'Partner HR dla nowoczesnych firm.',
  },
  {
    name: 'SkillMatch',
    logo: 'https://cdn-icons-png.flaticon.com/512/4363/4363898.png',
    description: 'Łączymy umiejętności z możliwościami.',
  },
  {
    name: 'FutureHire',
    logo: 'https://cdn-icons-png.flaticon.com/512/3182/3182584.png',
    description: 'Tworzymy przyszłość rynku pracy.',
  },
  {
    name: 'TalentBridge',
    logo: 'https://cdn-icons-png.flaticon.com/512/3405/3405870.png',
    description: 'Most między firmami a talentami.',
  },
  {
    name: 'NextStep',
    logo: 'https://cdn-icons-png.flaticon.com/512/3468/3468330.png',
    description: 'Twój kolejny krok w karierze.',
  },
  {
    name: 'CareerBoost',
    logo: 'https://cdn-icons-png.flaticon.com/512/1048/1048941.png',
    description: 'Przyspiesz swoją ścieżkę zawodową.',
  },
  {
    name: 'RecruitSmart',
    logo: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
    description: 'Inteligentne podejście do rekrutacji.',
  },
]);

const track = ref(null);

onMounted(() => {
  let scrollStep = 0.5;

  function autoScroll() {
    const el = track.value;
    if (!el) return;

    el.scrollLeft += scrollStep;

    if (el.scrollLeft >= el.scrollWidth / 2) {
      el.scrollLeft = 0;
    }

    requestAnimationFrame(autoScroll);
  }

  requestAnimationFrame(autoScroll);
});
</script>

<style>
:root {
  --primary: #fc4c4e;
  --bg: #ffffff;
  --bg-light: #ffffff;
  --text: #1a1a1a;
  --text-muted: #666;
  --card: #ffffff;
  --border: #ddd;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

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
  border-bottom: 1px solid var(--border);
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

.btn-generator {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: bold;
  text-decoration: none;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.btn-generator:hover {
  background: #e63a3c;
  transform: scale(1.05);
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

.btn-gradient {
  background: var(--primary);
  color: white !important;
  border: none;
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
  font-weight: 500;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.btn-gradient:hover {
  background: #e63a3c;
  transform: scale(1.02);
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

.partners-slider {
  background: var(--bg-light);
  padding: 3rem 1rem;
  overflow: hidden;
}

.partners-track {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.partners-track::-webkit-scrollbar {
  display: none;
}

.partner {
  flex: 0 0 auto;
  width: 200px;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  box-shadow: var(--shadow);
}

.partner img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.partner-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
}

.partner p {
  font-size: 0.875rem;
  color: var(--text-muted);
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.partners-track::after {
  content: '';
  display: block;
  flex: 0 0 auto;
  width: 2rem;
}
</style>
