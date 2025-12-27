<template>
  <div class="candidates-view container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary-gradient">Kandydaci</h1>

      <p class="text-muted">
        Oferta pracy: <strong>{{ jobTitle }}</strong>
      </p>

      <p class="text-muted">
        Liczba kandydatów: <strong>{{ candidates.length }}</strong>
      </p>
    </header>

    <div v-if="candidates.length === 0" class="text-center text-muted py-5">
      <i class="fa-regular fa-folder-open fa-3x mb-3"></i>

      <p>Brak kandydatów dla tej oferty.</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="candidate in candidates" :key="candidate.id" class="col-md-6 col-lg-4">
        <div class="card candidate-card shadow-sm border-0 h-100">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center mb-3">
              <div class="candidate-avatar me-3">
                {{ candidate.name[0] }}
              </div>

              <div>
                <h5 class="card-title fw-semibold mb-0">
                  {{ candidate.name }}
                </h5>

                <small class="text-muted">{{ candidate.email }}</small>
              </div>
            </div>

            <p class="text-muted flex-grow-1">
              <strong>Telefon:</strong> {{ candidate.tel }}

              <br />

              <strong>Doświadczenie:</strong>

              {{ candidate.experience }}

              <br />

              <strong>Miasto:</strong> {{ candidate.location }}
            </p>

            <div class="d-flex gap-2 mt-auto">
              <a
                :href="getCvFullUrl(candidate.cvUrl)"
                target="_blank"
                class="btn btn-outline-primary w-100"
              >
                <i class="fa-solid fa-file-pdf me-2"></i> CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/services/api';
import { useNotification } from '@/composables/useNotification';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

interface Candidate {
  id: string;
  name: string;
  email: string;
  tel: string;
  experience: string;
  location: string;
  cvUrl: string;
  jobId: string;
  jobTitle: string;
}

const notification = useNotification();
const route = useRoute();
const jobId = route.params.jobId as string;

const candidates = ref<Candidate[]>([]);
const jobTitle = ref('Ładowanie...');
const loading = ref(true);

const fetchCandidates = async () => {
  loading.value = true;
  try {
    const response = await api.get(`http://localhost:5000/api/applications/job/${jobId}`);

    if (!response.data) {
      if (response.status === 403) {
        notification.showMessage('Nie masz uprawnień do wyświetlenia tych kandydatów.', 'error');
        throw new Error('Nie masz uprawnień do wyświetlenia tych kandydatów.');
      }

      notification.showMessage('Błąd podczas ładowania kandydatów.', 'error');
      throw new Error('Błąd podczas pobierania kandydatów.');
    }

    const data = response.data;
    candidates.value = data;

    if (data.length > 0) {
      jobTitle.value = data[0].jobTitle;
    } else {
      jobTitle.value = 'Brak danych o stanowisku';
    }
  } catch {
    notification.showMessage('Błąd podczas ładowania kandydatów.', 'error');
  } finally {
    loading.value = false;
  }
};

const getCvFullUrl = (cvPath: string) => {
  return `http://localhost:5000/${cvPath}`;
};

onMounted(() => {
  fetchCandidates();
});
</script>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(90deg, #ff5666, #e14b59);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.candidate-card {
  transition: 0.25s ease;
}

.candidate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.candidate-avatar {
  background: #ffe8ea;
  color: #ff5666;
  font-weight: bold;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
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
