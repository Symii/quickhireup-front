<template>
  <div class="employer-job-list container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary-gradient">Moje ogłoszenia</h1>

      <p class="text-muted">
        Masz obecnie <strong>{{ myJobs.length }}</strong> ofert pracy.
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
        <div
          class="card job-card shadow-sm h-100 border-0"
          :class="{ 'opacity-75 bg-light': isOfferExpired(job.expiresAt) }"
        >
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center mb-3">
              <div class="company-icon me-3">{{ job.company[0] }}</div>

              <div>
                <h5 class="card-title fw-semibold mb-0">
                  {{ job.jobTitle }}

                  <span
                    v-if="isOfferExpired(job.expiresAt)"
                    class="badge bg-danger ms-2"
                    style="font-size: 0.6rem"
                  >
                    Wygasło
                  </span>

                  <span
                    v-else-if="!job.isActive"
                    class="badge bg-secondary ms-2"
                    style="font-size: 0.6rem"
                  >
                    Ukryte
                  </span>

                  <span v-else class="badge bg-success ms-2" style="font-size: 0.6rem">
                    Aktywne
                  </span>
                </h5>
                <small class="text-muted">{{ job.company }}</small>
              </div>

              <button class="btn btn-outline-danger btn-sm ms-auto" @click="removeJob(job.id)">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>

            <p class="card-text text-muted flex-grow-1">
              {{ job.description }}
            </p>

            <div class="d-flex justify-content-between text-muted small mb-3">
              <span>
                <i class="fa-regular fa-calendar-xmark me-1"></i>

                Wygasa:

                {{ new Date(job.expiresAt).toLocaleDateString() }}
              </span>
            </div>

            <div class="d-flex justify-content-between text-muted small mb-3">
              <span><i class="fa-regular fa-map me-1"></i>{{ job.location }}</span>

              <span><i class="fas fa-clock me-1"></i>{{ job.contractType }}</span>
            </div>

            <div class="d-flex gap-2 mt-auto flex-wrap">
              <button
                v-if="isOfferExpired(job.expiresAt)"
                class="btn btn-success w-100 mb-2"
                @click="extendOffer(job)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path :d="mdiClock" fill="white" />
                </svg>

                Przedłuż ofertę
              </button>

              <button
                class="btn w-100 mb-2"
                :class="job.isActive ? 'btn-outline-danger' : 'btn-outline-success'"
                :disabled="isOfferExpired(job.expiresAt)"
                @click="toggleJobStatus(job)"
              >
                <template v-if="isOfferExpired(job.expiresAt)">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path :d="mdiLock" fill="red" />
                  </svg>

                  Ogłoszenie wygasło
                </template>

                <template v-else>
                  <i
                    :class="job.isActive ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                    class="me-2"
                  ></i>

                  {{ job.isActive ? 'Ukryj ogłoszenie' : 'Pokaż ogłoszenie' }}
                </template>
              </button>

              <RouterLink :to="`/firma/edytuj-ogloszenie/${job.id}`" class="flex-grow-1">
                <button class="btn btn-outline-primary w-100">
                  <i class="fa-solid fa-pen-to-square me-2"></i> Edytuj
                </button>
              </RouterLink>

              <RouterLink :to="`/firma/kandydaci/${job.id}`" class="flex-grow-1">
                <button class="btn btn-gradient w-100">
                  <i class="fa-solid fa-user me-2"></i> Kandydaci
                </button>
              </RouterLink>
            </div>
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
import { useConfirm } from '@/composables/useConfirm';
import { useNotification } from '@/composables/useNotification';
import { mdiClock, mdiLock } from '@mdi/js';
import { ref, onMounted } from 'vue';

const notification = useNotification();
const myJobs = ref<JobOffer[]>([]);
const loading = ref(true);

const currentPage = ref(1);
const perPage = 6;
const pageInput = ref(1);
const totalPages = ref(1);
const totalCount = ref(0);

const changePage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    pageInput.value = page;

    await fetchJobs();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goToPage = () => {
  if (!pageInput.value || pageInput.value < 1 || pageInput.value > totalPages.value) {
    pageInput.value = currentPage.value;
    return;
  }
  changePage(pageInput.value);
};

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
  onlyMyOffers: 'true',
});

const fetchJobs = async () => {
  loading.value = true;
  try {
    filters.value.onlyMyOffers = 'true';
    const response = await jobOfferService.getPaged(currentPage.value, perPage, filters.value);

    myJobs.value = response.items;
    totalPages.value = response.totalPages;
    totalCount.value = response.totalCount;
    pageInput.value = response.page;
  } catch {
    notification.showMessage('Bład pobierania ogłoszeń', 'error');
  } finally {
    loading.value = false;
  }
};

const { confirm } = useConfirm();

const removeJob = async (id?: string) => {
  if (!id) {
    return;
  }

  const isConfirmed = await confirm(
    'Usuwanie ogłoszenia',
    'Czy na pewno chcesz usunąć to ogłoszenie?',
    { confirmText: 'Tak, usuń', cancelText: 'Nie, wróć' },
  );

  if (!isConfirmed) {
    return;
  }

  try {
    await jobOfferService.delete(id);

    myJobs.value = myJobs.value.filter((job) => job.id !== id);

    if (myJobs.value.length === 0 && currentPage.value > 1) {
      changePage(currentPage.value - 1);
    }
  } catch {
    notification.showMessage('Błąd podczas usuwania ogłoszenia', 'error');
  }
};

const toggleJobStatus = async (job: JobOffer) => {
  try {
    const response = await jobOfferService.toggleStatus(job.id!);
    job.isActive = response.isActive;

    if (job.isActive) {
      notification.showMessage('Pokazano ogłoszenie o pracę.');
    } else {
      notification.showMessage('Ukryto ogłoszenie o pracę.', 'info');
    }
  } catch {
    notification.showMessage('Błąd podczas zmiany statusu', 'error');
  }
};

const isOfferExpired = (expiresAt: string) => {
  return new Date(expiresAt) < new Date();
};

const extendOffer = async (job: JobOffer) => {
  try {
    const response = await jobOfferService.extend(job.id!);

    job.expiresAt = response.expiresAt;
    job.isActive = response.isActive;

    notification.showMessage(
      `Ogłoszenie zostało przedłużone do ${new Date(response.expiresAt).toLocaleDateString()}`,
    );
  } catch {
    notification.showMessage('Błąd podczas przedłużania ogłoszenia', 'error');
  }
};

onMounted(fetchJobs);
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
  height: 38px;
  padding: 5px 10px;
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
