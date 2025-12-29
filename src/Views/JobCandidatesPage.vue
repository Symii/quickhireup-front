<template>
  <div class="candidates-view container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary-gradient">Kandydaci</h1>

      <p v-if="jobTitle" class="text-muted">
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
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="d-flex align-items-center">
                <div class="candidate-avatar me-3">{{ candidate.name[0] }}</div>

                <div>
                  <h5 class="card-title fw-semibold mb-0">{{ candidate.name }}</h5>

                  <small class="text-muted">{{ candidate.email }}</small>
                </div>
              </div>

              <span class="badge" :class="statusClass(candidate.status)">
                <i :class="statusIcon(candidate.status)" class="me-1"></i>

                {{ statusLabel(candidate.status) }}
              </span>
            </div>

            <p class="text-muted flex-grow-1">
              <strong>Telefon:</strong> {{ candidate.tel }}<br />

              <strong>Doświadczenie:</strong> {{ candidate.experience }}

              <br />

              <strong>Miasto:</strong> {{ candidate.location }}
            </p>

            <div class="d-flex flex-column gap-2 mt-auto">
              <a
                :href="getCvFullUrl(candidate.cvUrl)"
                target="_blank"
                class="btn btn-outline-primary w-100"
              >
                <i class="fa-solid fa-file-pdf me-2"></i> CV
              </a>

              <div v-if="candidate.status === 'in_progress'" class="d-flex gap-2">
                <button
                  @click="updateStatus(candidate.id, 'accepted')"
                  class="btn btn-success flex-grow-1"
                >
                  <CheckCircleIcon class="icon" /> Przyjmij
                </button>

                <button
                  @click="updateStatus(candidate.id, 'rejected')"
                  class="btn btn-danger flex-grow-1"
                >
                  <ArchiveBoxXMarkIcon class="icon" /> Odrzuć
                </button>
              </div>

              <div v-else-if="candidate.status !== 'withdrawn'" class="d-flex gap-2">
                <button
                  @click="updateStatus(candidate.id, 'in_progress')"
                  class="btn btn-outline-secondary w-100"
                >
                  <BackwardIcon class="icon" /> Przywróć do rozpatrywania
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/services/api';
import { useConfirm } from '@/composables/useConfirm';
import { useNotification } from '@/composables/useNotification';
import { ArchiveBoxXMarkIcon, BackwardIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

type ApplicationStatus = 'in_progress' | 'rejected' | 'accepted' | 'withdrawn';

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
  status: ApplicationStatus;
}

const notification = useNotification();
const route = useRoute();
const jobId = route.params.jobId as string;
const candidates = ref<Candidate[]>([]);
const jobTitle = ref('');

const fetchCandidates = async () => {
  try {
    const response = await api.get(`http://localhost:5000/api/applications/job/${jobId}`);
    candidates.value = response.data;
    if (candidates.value.length > 0) jobTitle.value = candidates.value[0].jobTitle;
  } catch {
    notification.showMessage('Błąd podczas ładowania kandydatów.', 'error');
  }
};

const { confirm } = useConfirm();

const updateStatus = async (appId: string, status: ApplicationStatus) => {
  const isConfirmed = await confirm(
    'Zmiana statusu',
    `Czy na pewno chcesz zmienić status aplikacji na "${statusLabel(status)}"?`,
    { confirmText: 'Tak, zmień', cancelText: 'Nie, wróć' },
  );

  if (!isConfirmed) {
    return;
  }

  try {
    await api.patch(
      `http://localhost:5000/api/applications/${appId}/status`,
      JSON.stringify(status),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const candidate = candidates.value.find((c) => c.id === appId);
    if (candidate) {
      candidate.status = status;
    }
    notification.showMessage('Status został zaktualizowany.');
  } catch {
    notification.showMessage('Błąd podczas aktualizacji statusu.', 'error');
  }
};

const statusLabel = (status: ApplicationStatus): string => {
  const labels: Record<ApplicationStatus, string> = {
    in_progress: 'W trakcie',
    rejected: 'Odrzucona',
    accepted: 'Przyjęta',
    withdrawn: 'Wycofana',
  };
  return labels[status] || status;
};

const statusClass = (status: ApplicationStatus): string => {
  const classes: Record<ApplicationStatus, string> = {
    in_progress: 'bg-primary',
    rejected: 'bg-danger',
    accepted: 'bg-success',
    withdrawn: 'bg-warning text-dark',
  };
  return classes[status] || 'bg-secondary';
};

const statusIcon = (status: ApplicationStatus) => {
  const icons: Record<ApplicationStatus, string> = {
    in_progress: 'fa-solid fa-hourglass-half',
    rejected: 'fa-solid fa-x',
    accepted: 'fa-solid fa-lightbulb',
    withdrawn: 'fa-regular fa-circle-left',
  };
  return icons[status] || 'fa-regular fa-circle-question';
};

const getCvFullUrl = (cvPath: string) => `http://localhost:5000/${cvPath}`;

onMounted(fetchCandidates);
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

.icon {
  width: 20px;
  height: 20px;
}
</style>
