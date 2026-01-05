<template>
  <div class="container mt-20">
    <AlertMessage
      v-if="hasApplied"
      message="Już aplikowałeś na to stanowisko. Twoja aplikacja jest przetwarzana przez pracodawcę."
    />

    <header class="offer-header text-center mb-5">
      <h1>{{ job?.jobTitle }}</h1>

      <p class="lead">{{ job?.location }} • {{ job?.contractType }}</p>
    </header>

    <section class="offer-content row justify-content-center">
      <div class="col-lg-8 mb-4">
        <div class="offer-card shadow-sm p-4">
          <div v-if="job?.isActive" class="expiration-box mb-4 p-3 bg-light rounded border">
            <div class="d-flex justify-content-between align-items-end mb-2">
              <span class="fw-bold text-muted small text-uppercase">Ważność oferty</span>

              <span class="fw-bold" :class="daysLeft <= 3 ? 'text-danger' : 'text-primary'">
                <i class="fa-regular fa-clock me-1"></i> {{ progressLabel }}
              </span>
            </div>

            <div class="progress" style="height: 10px">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                :style="{ width: progressPercentage + '%' }"
                :class="progressColorClass"
                :aria-valuenow="progressPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <div class="text-end mt-1">
              <small class="text-muted" style="font-size: 0.7rem">
                Wygasa: {{ new Date(job?.expiresAt).toLocaleDateString() }}
              </small>
            </div>
          </div>

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
              v-if="user?.photoUrl"
              :src="`${envApiUrl}/${user?.photoUrl}`"
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

          <h4 class="mb-1">{{ user?.companyName }}</h4>

          <div class="decor-line"></div>

          <p class="text-muted small">{{ user?.bio }}</p>

          <RouterLink :to="`/profil-pracodawcy/${user?.id}`">
            <button
              class="btn btn-outline-primary mt-3"
              :style="{ borderColor: primaryColor, color: primaryColor }"
            >
              Zobacz profil pracodawcy
            </button>
          </RouterLink>
        </div>

        <div v-if="job?.salaryFrom" class="salary-card shadow-sm p-4 mt-4 text-center">
          <div class="salary-icon-circle mb-3">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path :d="mdiWallet" fill="#ffffff" />
            </svg>
          </div>

          <h5 class="text-muted small text-uppercase fw-bold mb-2">Proponowane wynagrodzenie</h5>

          <div class="salary-amount" :style="{ color: primaryColor }">
            {{ job.salaryFrom.toLocaleString() }} - {{ job.salaryTo.toLocaleString() }}

            <span class="currency-label">PLN</span>
          </div>

          <div class="salary-details mt-2">
            <span class="badge rounded-pill bg-light text-dark border">Brutto / miesięcznie</span>
          </div>
        </div>
      </div>
    </section>

    <section class="location-section mt-4 mb-5">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <div class="map-card shadow-sm overflow-hidden">
            <div class="row g-0">
              <div class="col-md-8">
                <div id="map" style="height: 350px; width: 100%"></div>
              </div>

              <div class="col-md-4 bg-white p-4 d-flex flex-column justify-content-center">
                <h4 class="section-subtitle mt-0 mb-3">Lokalizacja pracy</h4>

                <div class="d-flex align-items-start mb-3">
                  <MapPinIcon class="icon" />

                  <div>
                    <p class="mb-0 fw-bold">{{ job?.location }}</p>
                  </div>
                </div>

                <p class="text-muted small">
                  Dokładny adres i instrukcje zostaną przekazane w procesie rekrutacji.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="apply-bar text-center shadow-sm p-4 mt-5 bg-white">
      <button
        v-if="isLoggedIn"
        class="btn btn-outline-primary btn-lg px-4 me-3 mb-1"
        @click="toggleSaveJob"
        :class="{ 'applied-button': isSaved }"
      >
        <i :class="isSaved ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart'"></i>
        {{ isSaved ? 'Zapisano' : 'Zapisz' }}
      </button>

      <template v-if="!hasApplied">
        <RouterLink v-if="!isLoggedIn || isCandidate" :to="`/aplikuj/${job?.id}`">
          <button
            class="btn btn-primary btn-lg px-5 mb-1"
            :style="{ backgroundColor: primaryColor, borderColor: primaryColor }"
          >
            Aplikuj teraz
          </button>
        </RouterLink>
      </template>

      <template v-else>
        <button class="btn btn-secondary btn-lg px-5 applied-button mb-1" disabled>
          <i class="fa-solid fa-circle-check me-2"></i>

          Już zaaplikowano
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useAuthStore } from '@/api/authentication/authStore';
import api from '@/api/services/api';
import jobOfferService from '@/api/services/jobOfferService';
import usersService from '@/api/services/usersService';
import type { JobOffer } from '@/api/types/jobOffer';
import type { User } from '@/api/types/user';
import { useNotification } from '@/composables/useNotification';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { MapPinIcon } from '@heroicons/vue/24/solid';
import { RoleName } from '@/constants/RoleNames';
import AlertMessage from '@/components/AlertMessage.vue';
import { mdiWallet } from '@mdi/js';

const notification = useNotification();
const route = useRoute();
const id = route.params.id as string;

const envApiUrl = import.meta.env.VITE_API_URL;
const job = ref<JobOffer | null>(null);
const user = ref<User | null>(null);
const auth = useAuthStore();
const isLoggedIn = computed(() => auth.user != null);
const isCandidate = computed(() => auth.user?.role === RoleName.CANDIDATE);
const hasApplied = ref(false);

const daysLeft = computed(() => {
  if (!job.value?.expiresAt) {
    return 0;
  }

  const expires = new Date(job.value.expiresAt);
  const now = new Date();

  const diffTime = expires.getTime() - now.getTime();

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
});

const progressPercentage = computed(() => {
  const maxDays = 30;
  const current = daysLeft.value;
  const percentage = (current / maxDays) * 100;
  return Math.min(Math.max(percentage, 0), 100);
});

const progressColorClass = computed(() => {
  const days = daysLeft.value;
  if (days <= 3) {
    return 'bg-danger';
  }

  if (days <= 7) {
    return 'bg-warning';
  }
  return 'bg-success';
});

const progressLabel = computed(() => {
  const days = daysLeft.value;
  if (days === 0) {
    return 'Oferta wygasa dzisiaj';
  }

  if (days === 1) {
    return 'Pozostał 1 dzień';
  }

  return `Pozostało ${days} dni`;
});

const initMap = () => {
  const longitude = job.value?.longitude;
  const latitude = job.value?.latitude;

  if (longitude == null || latitude == null) {
    return;
  }

  const map = L.map('map', { scrollWheelZoom: false }).setView([latitude, longitude], 11);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map);
};

onMounted(async () => {
  job.value = await jobOfferService.getById(id);

  const userId = job.value?.userId;
  user.value = await usersService.getById(userId);

  if (isLoggedIn.value) {
    const response = await api.get(`/JobOffer/is-saved/${job.value.id}`);
    isSaved.value = response.data.isSaved;

    const appliedResponse = await api.get(`/Applications/check-application/${id}`);
    hasApplied.value = appliedResponse.data.hasApplied;
  }

  setTimeout(() => {
    initMap();
  }, 100);
});

const primaryColor = '#ff5666';

const isSaved = ref(false);
const isLoading = ref(false);

const toggleSaveJob = async () => {
  if (isLoading.value || !job.value) {
    return;
  }

  isLoading.value = true;
  try {
    const response = await api.post(`/JobOffer/toggle-save/${job.value.id}`);

    isSaved.value = response.data.isSaved;

    const message = isSaved.value
      ? `Dodano do zapisanych: ${job.value?.jobTitle}`
      : `Usunięto z zapisanych: ${job.value?.jobTitle}`;

    notification.showMessage(message, isSaved.value ? 'success' : 'info');
  } catch {
    notification.showMessage('Błąd połączenia z serwerem', 'error');
  } finally {
    isLoading.value = false;
  }
};
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
  z-index: 99999;
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
.btn-outline-primary {
  color: #ff5666;
  border-color: #ff5666;
}
.btn-outline-primary:hover {
  background-color: #ff5666;
  color: white !important;
}

.icon {
  color: #ff5666;
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.applied-button {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.progress {
  display: flex;
  height: 10px;
  overflow: hidden;
  line-height: 0;
  font-size: 0.75rem;
  background-color: #e9ecef;
  border-radius: 20px;
  position: relative;
  width: 100%;
}

.progress-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  transition: width 0.6s ease;
  height: 100%;
  border-radius: 20px;
}

.bg-success {
  background-color: #28a745 !important;
}
.bg-warning {
  background-color: #ffc107 !important;
}
.bg-danger {
  background-color: #dc3545 !important;
}

.expiration-box {
  border: 1px solid #f0f0f0;
  clear: both;
  position: relative;
}

.salary-card {
  background: #ffffff;
  border-radius: 12px;
  border-left: 5px solid #ff5666;
  transition: transform 0.3s ease;
}

.salary-card:hover {
  transform: translateY(-5px);
}

.salary-icon-circle {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ff5666, #e14b59);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(255, 86, 102, 0.3);
}

.salary-amount {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.currency-label {
  font-size: 0.9rem;
  font-weight: 600;
  vertical-align: middle;
  margin-left: 2px;
}

.salary-details .badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.5em 1em;
}
</style>
