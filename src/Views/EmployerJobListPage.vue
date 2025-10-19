<template>
  <div class="employer-job-list container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary-gradient">Moje ogłoszenia</h1>

      <p class="text-muted">
        Masz obecnie <strong>{{ myJobs.length }}</strong> aktywnych ofert pracy.
      </p>
    </header>

    <div v-if="myJobs.length === 0" class="text-center text-muted py-5">
      <i class="fa-regular fa-folder-open fa-3x mb-3"></i>

      <p>Nie masz jeszcze żadnych aktywnych ogłoszeń.</p>

      <RouterLink to="/firma/dodaj-ogloszenie">
        <button class="btn btn-gradient mt-2">
          <i class="fa-solid fa-plus me-2"></i> Dodaj ogłoszenie
        </button>
      </RouterLink>
    </div>

    <div v-else class="row g-4">
      <div v-for="job in myJobs" :key="job.id" class="col-md-6 col-lg-4">
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

            <div class="d-flex justify-content-between text-muted small mb-3">
              <span><i class="fa-regular fa-map me-1"></i>{{ job.location }}</span>

              <span><i class="fas fa-clock me-1"></i>{{ job.type }}</span>
            </div>

            <div class="d-flex gap-2 mt-auto">
              <RouterLink :to="`/firma/edytuj-ogloszenie/${job.id}`">
                <button class="btn btn-outline-primary w-100">
                  <i class="fa-solid fa-pen-to-square me-2"></i> Edytuj
                </button>
              </RouterLink>

              <RouterLink :to="`/firma/kandydaci/${job.id}`">
                <button class="btn btn-gradient w-100">
                  <i class="fa-solid fa-user me-2"></i> Kandydaci
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  employerId: number;
}

const loggedEmployerId = 1;

const jobs = ref<Job[]>([
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechNova',
    location: 'Warszawa',
    type: 'Pełny etat',
    experience: '1-3 lata',
    description: 'Budowa aplikacji w Vue 3.',
    employerId: 1,
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'CodeWave',
    location: 'Zdalnie',
    type: 'Pełny etat',
    experience: '3-5 lat',
    description: 'Tworzenie API w Node.js.',
    employerId: 2,
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'TechNova',
    location: 'Kraków',
    type: 'Część etatu',
    experience: '1-3 lata',
    description: 'Projektowanie interfejsów.',
    employerId: 1,
  },
]);

const myJobs = computed(() => {
  return jobs.value.filter((job) => job.employerId === loggedEmployerId);
});
</script>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(90deg, #ff5666, #e14b59);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
