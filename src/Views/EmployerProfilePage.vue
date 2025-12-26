<template>
  <div class="container mt-20">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else-if="employerData">
      <header class="company-header text-center mb-5">
        <h1>{{ employerData.name }}</h1>

        <p class="lead">{{ employerData.industry }} • {{ employerData.location }}</p>
      </header>

      <section class="company-content row justify-content-center">
        <div class="col-md-4 mb-4 text-center">
          <div class="company-card shadow-sm p-4">
            <div class="company-photo-wrapper position-relative mb-3">
              <img
                v-if="employerData.photoUrl"
                :src="`http://localhost:5000/${employerData.photoUrl}`"
                alt="Logo firmy"
                class="company-photo rounded-circle"
              />
              <div
                v-else
                class="placeholder-logo d-flex align-items-center justify-content-center rounded-circle mx-auto"
                :style="{ backgroundColor: primaryColor }"
              >
                <span class="text-white fw-bold h3 mb-0">{{ employerData.name[0] }}</span>
              </div>
            </div>

            <h4 class="mb-1">{{ employerData.name }}</h4>

            <p class="text-muted mb-1">{{ employerData.industry }}</p>

            <p class="text-muted small">{{ employerData.location }}</p>

            <div class="decor-line my-3"></div>

            <p class="text-muted small">{{ employerData.description }}</p>
          </div>
        </div>

        <div class="col-md-8">
          <div class="company-card shadow-sm p-4 bg-light">
            <h3 class="mb-4" :style="{ color: primaryColor }">
              Oferty pracy w {{ employerData.name }}
            </h3>

            <div v-if="employerData.jobOffers && employerData.jobOffers.length" class="row g-3">
              <div v-for="offer in employerData.jobOffers" :key="offer.id" class="col-md-6">
                <div class="job-card p-3 shadow-sm h-100 bg-white">
                  <h5 class="mb-1">{{ offer.jobTitle }}</h5>

                  <p class="text-muted small mb-2">{{ offer.location }}</p>

                  <p class="text-muted small">{{ offer.employmentType }}</p>

                  <p class="text-muted small">
                    <strong>{{ offer.salary }}</strong>
                  </p>

                  <div class="text-end mt-3">
                    <RouterLink :to="`/oferta/${offer.id}`">
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
              <p>Ten pracodawca nie ma jeszcze aktywnych ofert pracy.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/services/api';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

interface JobOffer {
  id: string;
  jobTitle: string;
  location: string;
  employmentType: string;
  salary: string;
}

interface Employer {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  photoUrl?: string;
  jobOffers: JobOffer[];
}

const route = useRoute();
const primaryColor = '#ff5666';

const employerData = ref<Employer | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const fetchEmployerData = async () => {
  const employerId = route.params.id;

  if (!employerId) {
    error.value = 'Brak identyfikatora pracodawcy.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await api.get(`http://localhost:5000/api/employers/${employerId}`);

    if (!response) {
      throw new Error('Nie udało się pobrać danych pracodawcy.');
    }

    const data = await response.data;
    employerData.value = data;
  } catch (err) {
    console.error(err);
    error.value = 'Wystąpił błąd podczas ładowania profilu.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchEmployerData();
});
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
