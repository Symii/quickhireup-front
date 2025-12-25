<template>
  <div class="container mt-20">
    <header class="offer-header text-center mb-5">
      <h1>{{ job?.jobTitle }}</h1>

      <p class="lead">{{ job?.location }} • {{ job?.contractType }}</p>
    </header>

    <section class="offer-content row justify-content-center">
      <div class="col-lg-8 mb-4">
        <div class="offer-card shadow-sm p-4">
          <h3 class="section-title mb-3" :style="{ color: primaryColor }">Opis stanowiska</h3>

          <p class="text-muted mb-4">{{ job?.description }}</p>

          <h4 class="section-subtitle">Wymagania</h4>

          <p class="text-muted mb-4">{{ job?.qualifications }}</p>

          <template v-if="job?.benefits">
            <h4 class="section-subtitle">Oferujemy</h4>

            <p class="text-muted mb-4">{{ job?.benefits }}</p>
          </template>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="company-card shadow-sm p-4 text-center bg-light">
          <div class="company-photo-wrapper mb-3">
            <img
              v-if="employer.logo"
              :src="employer.logo"
              alt="Logo firmy"
              class="company-photo rounded-circle"
            />

            <div
              v-else
              class="placeholder-logo d-flex align-items-center justify-content-center rounded-circle"
            >
              <i class="fa-solid fa-building fa-2x text-white"></i>
            </div>
          </div>

          <h4 class="mb-1">{{ employer.name }}</h4>

          <p class="text-muted mb-1">{{ employer.industry }}</p>

          <p class="text-muted small">{{ employer.location }}</p>

          <div class="decor-line"></div>

          <p class="text-muted small">{{ employer.description }}</p>

          <RouterLink to="/profil-pracodawcy/1">
            <button
              class="btn btn-outline-primary mt-3"
              :style="{ borderColor: primaryColor, color: primaryColor }"
            >
              Zobacz profil pracodawcy
            </button>
          </RouterLink>
        </div>
      </div>
    </section>

    <div class="apply-bar text-center shadow-sm p-4 mt-5 bg-white">
      <RouterLink to="/aplikuj/1">
        <button
          class="btn btn-primary btn-lg px-5"
          :style="{ backgroundColor: primaryColor, borderColor: primaryColor }"
        >
          Aplikuj teraz
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import jobOfferService from '@/api/services/jobOfferService';
import type { JobOffer } from '@/api/types/jobOffer';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id as string;

const job = ref<JobOffer | null>(null);

onMounted(async () => {
  job.value = await jobOfferService.getById(id);
});

const primaryColor = '#ff5666';

const employer = reactive({
  name: 'TechNova',
  industry: 'IT / Software',
  location: 'Warszawa',
  description: 'Firma tworząca nowoczesne aplikacje webowe i mobilne.',
  logo: '',
});
</script>

<style scoped>
.offer-header {
  background: linear-gradient(135deg, #ff5666, #e14b59);
  color: white;
  padding: 3rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.offer-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.offer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-top: 1.5rem;
}

.company-card {
  border-radius: 12px;
}

.company-photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid #ff5666;
}

.placeholder-logo {
  width: 120px;
  height: 120px;
  background-color: #ff5666;
  margin: 0 auto;
}

.apply-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.btn-primary {
  background-color: #ff5666;
  border-color: #ff5666;
  font-weight: 600;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.btn-primary:hover {
  background-color: #e14b59;
  box-shadow: 0 6px 20px rgba(225, 75, 89, 0.5);
}

.decor-line {
  width: 30%;
  height: 4px;
  background: linear-gradient(to right, #ff5666, #e14b59);
  margin: 12px auto;
  border-radius: 2px;
}

.mt-20 {
  margin-top: 20px;
}

.btn-outline-primary:hover {
  background-color: #ff5666;
  color: white !important;
}
</style>
