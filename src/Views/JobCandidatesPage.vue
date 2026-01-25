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

            <div class="mb-3">
              <p class="text-muted small mb-1"><strong>Telefon:</strong> {{ candidate.tel }}</p>

              <p class="text-muted small mb-1"><strong>Doświadczenie:</strong></p>

              <pre class="bg-light p-2 rounded">{{ candidate.experience }}</pre>
            </div>

            <div class="mb-3">
              <p class="text-muted small mb-1"><strong>Edukacja:</strong></p>

              <pre class="bg-light p-2 rounded">{{ candidate.education }}</pre>
            </div>

            <div v-if="candidate.coverLetter" class="mb-3">
              <p class="text-muted small mb-1"><strong>List motywacyjny:</strong></p>

              <pre class="bg-light p-2 rounded">{{ candidate.coverLetter }}</pre>
            </div>

            <div class="d-flex flex-column gap-2 mt-auto">
              <a
                :href="getCvFullUrl(candidate.cvUrl)"
                target="_blank"
                class="btn btn-outline-primary w-100"
              >
                <i class="fa-solid fa-file-pdf me-2"></i> Zobacz CV
              </a>

              <div v-if="candidate.status === 'in_progress'" class="d-flex gap-2">
                <button
                  @click="openDecisionModal(candidate.id, 'accepted')"
                  class="btn btn-success flex-grow-1"
                >
                  <CheckCircleIcon class="icon" /> Przyjmij
                </button>

                <button
                  @click="openDecisionModal(candidate.id, 'rejected')"
                  class="btn btn-danger flex-grow-1"
                >
                  <ArchiveBoxXMarkIcon class="icon" /> Odrzuć
                </button>
              </div>

              <button
                v-else-if="candidate.status !== 'withdrawn'"
                @click="updateStatusSimple(candidate.id, 'in_progress')"
                class="btn btn-outline-secondary w-100"
              >
                <BackwardIcon class="icon" /> Przywróć
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDecisionModal" class="modal-backdrop fade show"></div>

    <div v-if="showDecisionModal" class="modal d-block" tabindex="-1" style="top: 10%">
      <div class="modal-dialog">
        <div class="modal-content shadow-lg border-0">
          <div
            class="modal-header text-white"
            :class="decisionType === 'accepted' ? 'bg-success' : 'bg-danger'"
          >
            <h5 class="modal-title">
              {{ decisionType === 'accepted' ? 'Akceptacja kandydata' : 'Odrzucenie aplikacji' }}
            </h5>

            <button
              type="button"
              class="btn-close btn-close-white"
              @click="showDecisionModal = false"
            ></button>
          </div>

          <div class="modal-body py-4">
            <label class="form-label fw-bold">
              {{
                decisionType === 'accepted'
                  ? 'Dalsze kroki / Wiadomość dla kandydata'
                  : 'Powód odrzucenia'
              }}
            </label>

            <textarea
              v-model="decisionNote"
              class="form-control"
              rows="4"
              :placeholder="
                decisionType === 'accepted'
                  ? 'Np. Zapraszamy na rozmowę w poniedziałek...'
                  : 'Np. Brak wymaganego doświadczenia...'
              "
            ></textarea>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="showDecisionModal = false">
              Anuluj
            </button>

            <button
              type="button"
              :class="decisionType === 'accepted' ? 'btn btn-success' : 'btn btn-danger'"
              @click="submitDecision"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>

              Zatwierdź i wyślij
            </button>
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
  education: string;
  coverLetter: string;
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

const showDecisionModal = ref(false);
const decisionType = ref<'accepted' | 'rejected'>('accepted');
const decisionNote = ref('');
const selectedAppId = ref<string | null>(null);
const isSubmitting = ref(false);

const fetchCandidates = async () => {
  try {
    const envApiUrl = import.meta.env.VITE_API_URL;
    const response = await api.get(`${envApiUrl}/api/applications/job/${jobId}`);
    candidates.value = response.data;
    console.log(response.data);
    if (candidates.value.length > 0) jobTitle.value = candidates.value[0].jobTitle;
  } catch {
    notification.showMessage('Błąd podczas ładowania kandydatów.', 'error');
  }
};

const openDecisionModal = (appId: string, type: 'accepted' | 'rejected') => {
  selectedAppId.value = appId;
  decisionType.value = type;
  decisionNote.value = '';
  showDecisionModal.value = true;
};

const submitDecision = async () => {
  if (!selectedAppId.value) return;
  isSubmitting.value = true;

  try {
    const envApiUrl = import.meta.env.VITE_API_URL;
    await api.patch(`${envApiUrl}/api/applications/${selectedAppId.value}/status`, {
      status: decisionType.value,
      note: decisionNote.value,
    });

    const candidate = candidates.value.find((c) => c.id === selectedAppId.value);
    if (candidate) candidate.status = decisionType.value;

    notification.showMessage('Status został pomyślnie zmieniony.');
    showDecisionModal.value = false;
  } catch {
    notification.showMessage('Błąd podczas aktualizacji statusu.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const { confirm } = useConfirm();

const updateStatusSimple = async (appId: string, status: ApplicationStatus) => {
  const isConfirmed = await confirm(
    'Przywróć aplikację',
    'Czy na pewno chcesz przywrócić tę aplikację do statusu "W trakcie"?',
    { confirmText: 'Tak, przywróć', cancelText: 'Nie, wróć' },
  );

  if (!isConfirmed) {
    return;
  }

  try {
    const envApiUrl = import.meta.env.VITE_API_URL;
    await api.patch(`${envApiUrl}/api/applications/${appId}/status`, { status });
    const candidate = candidates.value.find((c) => c.id === appId);
    if (candidate) candidate.status = status;
    notification.showMessage('Przywrócono aplikację.');
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

const envApiUrl = import.meta.env.VITE_API_URL;
const getCvFullUrl = (cvPath: string) => `${envApiUrl}/${cvPath}`;

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

.icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}

pre {
  font-family: inherit;
  color: #666;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  z-index: 1050;
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
