<template>
  <div class="container mt-20">
    <header class="company-header text-center mb-5">
      <h1>{{ employerData.name }}</h1>

      <p class="lead">{{ employerData.industry }} • {{ employerData.location }}</p>
    </header>

    <section class="company-content row justify-content-center">
      <div class="col-md-4 mb-4 text-center">
        <div class="company-card shadow-sm p-4">
          <div class="company-photo-wrapper position-relative mb-3">
            <img
              v-if="employerPhoto"
              :src="employerPhoto"
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

          <h4 class="mb-1">{{ employerData.name }}</h4>

          <p class="text-muted mb-1">{{ employerData.industry }}</p>

          <p class="text-muted small">{{ employerData.location }}</p>

          <div class="decor-line"></div>

          <p class="text-muted small">{{ employerData.description }}</p>
        </div>
      </div>

      <div class="col-md-8">
        <div class="company-card shadow-sm p-4 bg-light">
          <h3 class="mb-4" :style="{ color: primaryColor }">
            Oferty pracy w {{ employerData.name }}
          </h3>

          <div v-if="jobOffers.length" class="row g-3">
            <div v-for="offer in jobOffers" :key="offer.id" class="col-md-6">
              <div class="job-card p-3 shadow-sm h-100">
                <h5 class="mb-1">{{ offer.title }}</h5>

                <p class="text-muted small mb-2">{{ offer.location }}</p>

                <p class="text-muted small">{{ offer.type }}</p>

                <div class="text-end mt-3">
                  <RouterLink to="/oferta/1">
                    <button
                      class="btn btn-outline-primary btn-sm"
                      :style="{ borderColor: primaryColor, color: primaryColor }"
                    >
                      Zobacz szczegóły
                    </button>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center text-muted py-4">
            <i class="fa-solid fa-briefcase fa-2x mb-3"></i>

            <p>Ten pracodawca nie ma jeszcze aktywnych ofert pracy.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const primaryColor = '#ff5666';

const employerData = reactive({
  name: 'TechNova',
  industry: 'IT / Software',
  location: 'Warszawa',
  description: 'Firma tworząca nowoczesne aplikacje webowe i mobilne.',
});

const employerPhoto = ref('');

const jobOffers = reactive([
  {
    id: 1,
    title: 'Frontend Developer (Vue.js)',
    location: 'Warszawa / zdalnie',
    type: 'Pełny etat',
  },
  { id: 2, title: 'Backend Developer (Node.js)', location: 'Warszawa', type: 'Pełny etat' },
  { id: 3, title: 'UX/UI Designer', location: 'Zdalnie', type: 'Kontrakt' },
]);
</script>

<style scoped>
.company-header {
  background: linear-gradient(135deg, #ff5666, #e14b59);
  color: white;
  padding: 3rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.company-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.company-photo-wrapper {
  position: relative;
  display: inline-block;
}

.company-photo {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border: 4px solid #ff5666;
}

.placeholder-logo {
  width: 140px;
  height: 140px;
  background-color: #ff5666;
}

.job-card {
  background: #fff;
  border-radius: 10px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.job-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 86, 102, 0.2);
}

.btn-outline-primary:hover {
  background-color: #ff5666;
  color: white !important;
}

.mt-20 {
  margin-top: 20px;
}

.decor-line {
  width: 30%;
  height: 4px;
  background: linear-gradient(to right, #ff5666, #e14b59);
  margin: 12px auto;
  border-radius: 2px;
}
</style>
