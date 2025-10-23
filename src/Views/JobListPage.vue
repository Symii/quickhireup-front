<template>
  <div class="job-list-view container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary-gradient">Wyniki wyszukiwania</h1>

      <p class="text-muted">
        Znaleziono {{ filteredJobs.length }} ofert pracy pasujących do Twoich kryteriów.
      </p>
    </header>

    <div class="filters-card shadow-sm p-4 mb-4 bg-white rounded-3">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label class="form-label">Stanowisko / słowo kluczowe</label>

          <input
            type="text"
            v-model="filters.keyword"
            class="form-control"
            placeholder="np. Developer, Manager..."
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">Lokalizacja</label>

          <input
            type="text"
            v-model="filters.location"
            class="form-control"
            placeholder="np. Warszawa"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Rodzaj pracy</label>

          <select v-model="filters.type" class="form-select">
            <option value="">Dowolny</option>

            <option>Pełny etat</option>

            <option>Część etatu</option>

            <option>Zdalnie</option>

            <option>Hybrydowo</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Doświadczenie</label>

          <select v-model="filters.experience" class="form-select">
            <option value="">Dowolne</option>

            <option>Brak</option>

            <option>1-3 lata</option>

            <option>3-5 lat</option>

            <option>5+ lat</option>
          </select>
        </div>

        <div class="col-md-2 text-end">
          <button class="btn btn-gradient w-100" @click="resetFilters">Wyczyść</button>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div v-for="job in paginatedJobs" :key="job.id" class="col-md-6 col-lg-4">
        <div class="card job-card shadow-sm h-100 border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center mb-3">
              <div class="company-icon me-3">{{ job.company[0] }}</div>

              <div>
                <h5 class="card-title fw-semibold mb-0">{{ job.title }}</h5>

                <small class="text-muted">{{ job.company }}</small>
              </div>
            </div>

            <p class="card-text text-muted flex-grow-1">
              {{ job.description }}
            </p>

            <div class="d-flex justify-content-between text-muted small">
              <span><i class="fa-regular fa-map me-1"></i>{{ job.location }}</span>

              <span><i class="fas fa-clock me-1"></i>{{ job.type }}</span>
            </div>

            <RouterLink :to="`/oferta/${job.id}`">
              <button class="btn btn-gradient w-100 mt-3">
                <i class="fa-regular fa-circle-right me-2"></i> Zobacz ofertę
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <nav class="mt-5 d-flex justify-content-center align-items-center gap-3 pagination-custom">
      <button
        class="btn btn-outline-primary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ‹
      </button>

      <div class="d-flex align-items-center gap-2">
        <input
          type="number"
          v-model.number="pageInput"
          @change="goToPage"
          class="form-control page-input"
          :min="1"
          :max="totalPages"
          style="width: 70px; text-align: center"
        />

        <span class="text-muted">z {{ totalPages }} stron</span>
      </div>

      <button
        class="btn btn-outline-primary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        ›
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  description: string;
}

const jobs = ref<Job[]>([
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechNova',
    location: 'Warszawa',
    type: 'Pełny etat',
    experience: '1-3 lata',
    description: 'Budowa aplikacji w Vue 3.',
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'CodeWave',
    location: 'Zdalnie',
    type: 'Pełny etat',
    experience: '3-5 lat',
    description: 'Tworzenie API w Node.js.',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'Kraków',
    type: 'Część etatu',
    experience: '1-3 lata',
    description: 'Projektowanie interfejsów.',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudOps',
    location: 'Zdalnie',
    type: 'Pełny etat',
    experience: '5+ lat',
    description: 'Utrzymanie infrastruktury w AWS.',
  },
  {
    id: 5,
    title: 'QA Tester',
    company: 'SoftCheck',
    location: 'Łódź',
    type: 'Pełny etat',
    experience: '1-3 lata',
    description: 'Testowanie aplikacji webowych.',
  },
  {
    id: 6,
    title: 'Data Analyst',
    company: 'DataMinds',
    location: 'Poznań',
    type: 'Pełny etat',
    experience: '3-5 lat',
    description: 'Analiza danych biznesowych.',
  },
  {
    id: 7,
    title: 'HR Specialist',
    company: 'PeopleFirst',
    location: 'Warszawa',
    type: 'Część etatu',
    experience: '1-3 lata',
    description: 'Wsparcie działu HR.',
  },
  {
    id: 8,
    title: 'Fullstack Developer',
    company: 'WebCraft',
    location: 'Wrocław',
    type: 'Pełny etat',
    experience: '3-5 lat',
    description: 'React + Node.js.',
  },
  {
    id: 9,
    title: 'Project Manager',
    company: 'InnoTech',
    location: 'Warszawa',
    type: 'Pełny etat',
    experience: '5+ lat',
    description: 'Zarządzanie projektami IT.',
  },
  {
    id: 10,
    title: 'Marketing Specialist',
    company: 'AdFlow',
    location: 'Kraków',
    type: 'Pełny etat',
    experience: '1-3 lata',
    description: 'Tworzenie kampanii online.',
  },
  {
    id: 11,
    title: 'AI Engineer',
    company: 'FutureAI',
    location: 'Zdalnie',
    type: 'Pełny etat',
    experience: '5+ lat',
    description: 'Budowa modeli ML.',
  },
]);

const filters = ref({
  keyword: '',
  location: '',
  type: '',
  experience: '',
});

const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const keywordMatch =
      job.title.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.value.keyword.toLowerCase());
    const locationMatch = filters.value.location
      ? job.location.toLowerCase().includes(filters.value.location.toLowerCase())
      : true;
    const typeMatch = filters.value.type ? job.type === filters.value.type : true;
    const expMatch = filters.value.experience ? job.experience === filters.value.experience : true;

    return keywordMatch && locationMatch && typeMatch && expMatch;
  });
});

const currentPage = ref(1);
const perPage = 6;
const totalPages = computed(() => Math.ceil(filteredJobs.value.length / perPage));

const pageInput = ref(1);

watch(currentPage, () => {
  pageInput.value = currentPage.value;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToPage = () => {
  if (!pageInput.value || pageInput.value < 1 || pageInput.value > totalPages.value) {
    pageInput.value = currentPage.value;
    return;
  }
  changePage(Number(pageInput.value));
};

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredJobs.value.slice(start, start + perPage);
});

const resetFilters = () => {
  filters.value = { keyword: '', location: '', type: '', experience: '' };
  currentPage.value = 1;
};
</script>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(90deg, #ff5666, #e14b59);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.filters-card {
  border: 1px solid #eee;
  border-radius: 12px;
}

.job-card {
  transition: 0.25s ease;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.company-icon {
  background: #ffe8ea;
  color: #ff5666;
  font-weight: bold;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-gradient {
  background: linear-gradient(90deg, #ff5666, #e14b59);
  color: white;
  border: none;
}

.btn-gradient:hover {
  opacity: 0.9;
}

.pagination .page-link {
  color: #ff5666;
}

.pagination .page-item.active .page-link {
  background-color: #ff5666;
  border-color: #ff5666;
  color: white;
}

.pagination-custom .btn {
  border-radius: 8px;
  font-weight: 600;
  min-width: 40px;
}

.pagination-custom .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.4rem 0.6rem !important;
  transition: 0.2s;
}

.page-input:focus {
  outline: none;
  border-color: #ff5666;
  box-shadow: 0 0 0 2px rgba(255, 86, 102, 0.2);
}

.btn-outline-primary {
  color: #ff5666;
  border-color: #ff5666;
}

.btn-outline-primary:hover {
  background-color: #ff5666;
  color: white;
  border-color: #ff5666;
}
</style>
