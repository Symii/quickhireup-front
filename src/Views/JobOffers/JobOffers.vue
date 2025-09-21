<template>
  <div class="job-board container py-5">
    <h1 class="text-center fw-bold mb-5 text-primary-gradient">Najnowsze Oferty Pracy</h1>

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
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
]);
</script>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(90deg, #ff5666, #ff8794);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.job-card {
  border-radius: 1.25rem;
  transition: all 0.3s ease;
  background-color: #fff;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(255, 86, 102, 0.15);
}

.company-icon {
  background: rgba(255, 86, 102, 0.1);
  color: #ff5666;
  font-weight: bold;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.btn-gradient {
  background: linear-gradient(90deg, #ff5666, #ff2a44);
  color: white;
  border: none;
  transition: background 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(90deg, #e04353, #b2222f);
  color: white;
}
</style>
