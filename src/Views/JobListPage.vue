<template>
  <div class="job-list-view container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary-gradient">Wyniki wyszukiwania</h1>

      <p class="text-muted">
        Znaleziono <strong>{{ totalCount }}</strong> ofert pracy pasujących do Twoich kryteriów.
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
          <label class="form-label">Rodzaj pracy</label>

          <select v-model="filters.type" class="form-select">
            <option value="">Dowolny</option>

            <option>Pełny etat</option>

            <option>Część etatu</option>

            <option>Zdalnie</option>

            <option>Hybrydowo</option>
          </select>
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

        <div class="col-md-3">
          <label class="form-label">Odległość</label>

          <select v-model="filters.distance" class="form-select">
            <option value="">+0 km</option>

            <option value="10">+10 km</option>

            <option value="20">+20 km</option>

            <option value="30">+30 km</option>

            <option value="50">+50 km</option>

            <option value="100">+100 km</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Doświadczenie</label>

          <select v-model="filters.experience" class="form-select">
            <option value="">Dowolne</option>

            <option>Brak doświadczenia</option>

            <option>Do 1 roku</option>

            <option>1-3 lata</option>

            <option>3-5 lat</option>

            <option>Powyżej 5 lat</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Wynagrodzenie od</label>

          <input
            type="number"
            v-model.number="filters.minSalary"
            class="form-control"
            placeholder="np. 5000"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">Wynagrodzenie do</label>

          <input
            type="number"
            v-model.number="filters.maxSalary"
            class="form-control"
            placeholder="np. 12000"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">Sortowanie</label>

          <select v-model="filters.sort" class="form-select">
            <option value="">Domyślne</option>

            <option value="newest">Najnowsze</option>

            <option value="oldest">Najstarsze</option>

            <option value="salaryAsc">Wynagrodzenie rosnąco</option>

            <option value="salaryDesc">Wynagrodzenie malejąco</option>
          </select>
        </div>

        <div class="col-md-2 text-end ms-auto">
          <button class="btn btn-gradient w-100" @click="applyFilters">Szukaj</button>
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
                <h5 class="card-title fw-semibold mb-0">{{ job.jobTitle }}</h5>

                <small class="text-muted">{{ job.company }}</small>
              </div>
            </div>

            <p class="card-text text-muted flex-grow-1">
              {{ job.description }}
            </p>

            <div class="d-flex justify-content-between text-muted small">
              <span><i class="fa-regular fa-map me-1"></i>{{ job.location }}</span>

              <span><i class="fas fa-clock me-1"></i>{{ job.contractType }}</span>
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
import jobOfferService from '@/api/services/jobOfferService';
import type { JobOfferFilters } from '@/api/types/filters/jobOfferFilters';
import type { JobOffer } from '@/api/types/jobOffer';
import { ref, computed, watch, onMounted } from 'vue';

const jobs = ref<JobOffer[]>([]);
const totalPages = ref(1);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 6;

const filters = ref<JobOfferFilters>({
  keyword: '',
  location: '',
  distance: '',
  latitude: null,
  longitude: null,
  type: '',
  experience: '',
  minSalary: null,
  maxSalary: null,
  sort: '',
});

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

filters.value = {
  keyword: String(route.query.keyword || ''),
  location: String(route.query.location || ''),
  distance: String(route.query.distance || ''),
  latitude: route.query.latitude ? Number(route.query.latitude) : null,
  longitude: route.query.longitude ? Number(route.query.longitude) : null,
  type: String(route.query.type || ''),
  experience: String(route.query.experience || ''),
  minSalary: route.query.minSalary ? Number(route.query.minSalary) : null,
  maxSalary: route.query.maxSalary ? Number(route.query.maxSalary) : null,
  sort: '',
};

const sortFromQuery = Array.isArray(route.query.sort) ? route.query.sort[0] : route.query.sort;

if (
  sortFromQuery === 'newest' ||
  sortFromQuery === 'oldest' ||
  sortFromQuery === 'salaryAsc' ||
  sortFromQuery === 'salaryDesc'
) {
  filters.value.sort = sortFromQuery;
} else {
  filters.value.sort = '';
}

watch(
  filters,
  () => {
    const query: Record<string, string | number> = {};

    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        query[key] = value;
      }
    });

    router.replace({ query });
  },
  { deep: true },
);

const applyFilters = async () => {
  currentPage.value = 1;

  if (filters.value.location) {
    const result = await jobOfferService.geocode(filters.value.location);
    if (result) {
      filters.value.latitude = result.lat;
      filters.value.longitude = result.lng;
    }
  } else {
    filters.value.latitude = null;
    filters.value.longitude = null;
  }

  await loadJobs();
};

const loadJobs = async () => {
  const response = await jobOfferService.getPaged(currentPage.value, pageSize, filters.value);

  jobs.value = response.items;
  totalPages.value = response.totalPages;
  totalCount.value = response.totalCount;
};

watch(currentPage, loadJobs);

onMounted(loadJobs);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    pageInput.value = page;
  }
};

const pageInput = ref(1);
const goToPage = () => changePage(pageInput.value);

const paginatedJobs = computed(() => jobs.value);
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
