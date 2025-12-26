<template>
  <div class="container mt-20">
    <header class="jobs-header text-center mb-5">
      <h1>Zapisane ogłoszenia o pracę</h1>

      <p class="lead">
        Przeglądaj i zarządzaj ogłoszeniami, które zapisałeś. Możesz je usuwać lub otworzyć
        szczegóły.
      </p>
    </header>

    <section class="jobs-content row">
      <div v-if="isLoading" class="text-center col-12 py-5">
        <div class="spinner-border text-primary" role="status"></div>

        <p class="mt-2">Wczytywanie Twoich ofert...</p>
      </div>

      <template v-else-if="savedJobs.length">
        <div v-for="job in savedJobs" :key="job.id" class="col-md-6 mb-4">
          <div class="job-card shadow-sm p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 class="mb-1">{{ job.jobTitle }}</h5>

                <p class="text-muted mb-1">{{ job.company }}</p>

                <p class="text-muted small">{{ job.location }}</p>
              </div>

              <button class="btn btn-outline-danger btn-sm" @click="removeJob(job.id)">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>

            <p class="text-muted small mb-3">{{ job.description }}</p>

            <div class="text-end">
              <RouterLink :to="`oferta/${job.id}`" class="btn btn-gradient"
                >Zobacz ogłoszenie</RouterLink
              >
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="col-12 empty-state text-center">
          <img :src="'empty_state.jpg'" alt="Brak zapisanych ogłoszeń" style="max-width: 60%" />

          <h4 class="mb-2">Brak zapisanych ogłoszeń</h4>

          <p class="text-muted mb-3">
            Wygląda na to, że nie zapisałeś jeszcze żadnej oferty pracy. Zacznij przeglądać dostępne
            ogłoszenia!
          </p>

          <RouterLink to="/oferty" class="btn btn-gradient mb-5">Przejdź do ofert</RouterLink>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/services/api';
import { useNotification } from '@/composables/useNotification';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

interface Job {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  description: string;
}

const savedJobs = ref<Job[]>([]);
const isLoading = ref(true);
const notification = useNotification();

const fetchSavedJobs = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/JobOffer/my-saved-jobs');
    savedJobs.value = response.data;
  } catch {
    notification.showMessage('Nie udało się pobrać zapisanych ofert', 'error');
  } finally {
    isLoading.value = false;
  }
};

const removeJob = async (id: string) => {
  try {
    await api.post(`/JobOffer/toggle-save/${id}`);

    savedJobs.value = savedJobs.value.filter((job) => job.id !== id);

    notification.showMessage('Usunięto ofertę z zapisanych', 'info');
  } catch {
    notification.showMessage('Błąd podczas usuwania oferty', 'error');
  }
};

onMounted(fetchSavedJobs);
</script>

<style scoped>
.jobs-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 2.5rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.job-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.job-card:hover {
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

h5 {
  font-weight: 600;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.empty-state i {
  display: block;
  margin: 0 auto 10px;
}

.empty-state h4 {
  font-weight: 600;
}

.mt-20 {
  margin-top: 20px;
}
</style>
