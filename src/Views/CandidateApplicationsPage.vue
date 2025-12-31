<template>
  <div class="candidate-apps container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary-gradient">Moje aplikacje</h1>

      <p class="text-muted">
        Złożyłeś <strong>{{ applications.length }}</strong> CV.
      </p>
    </header>

    <div v-if="applications.length === 0" class="text-center text-muted py-5">
      <i class="fa-brands fa-searchengin fa-3x mb-3"></i>

      <p>Nie masz jeszcze żadnych aplikacji.</p>

      <RouterLink to="/oferty">
        <button class="btn btn-gradient mt-2">Przeglądaj oferty</button>
      </RouterLink>
    </div>

    <div v-else class="row g-4">
      <div v-for="app in paginatedApps" :key="app.id" class="col-md-6 col-lg-4">
        <div class="card app-card shadow-sm h-100 border-0">
          <div class="card-body d-flex flex-column">
            <div class="mb-3">
              <h5 class="card-title fw-semibold mb-1">{{ app.jobTitle }}</h5>

              <small class="text-muted">{{ app.company }}</small>
            </div>

            <p class="card-text text-muted flex-grow-1">
              Złożono: {{ formatDate(app.submittedAt) }}
            </p>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="badge" :class="statusClass(app.status)">
                <i :class="statusIcon(app.status)" class="me-1"></i>

                {{ statusLabel(app.status) }}
              </span>

              <span class="text-muted small">{{ app.location }} • {{ app.type }}</span>
            </div>

            <div class="d-flex gap-2 mt-auto">
              <RouterLink :to="`/oferta/${app.jobId}`">
                <button class="btn btn-outline-primary">
                  <i class="fa-regular fa-circle-right me-2"></i> Zobacz ofertę
                </button>
              </RouterLink>

              <button
                v-if="app.status === 'in_progress'"
                class="btn btn-gradient"
                @click="withdraw(app.id)"
              >
                <i class="fa-regular fa-circle-left me-2"></i> Cofnij aplikację
              </button>

              <button
                v-if="app.status === 'withdrawn'"
                class="btn btn-outline-danger"
                @click="deleteApp(app.id)"
              >
                <i class="fa-regular fa-trash-can me-2"></i> Usuń z historii
              </button>
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
import { useConfirm } from '@/composables/useConfirm';
import api from '@/api/services/api';
import { useNotification } from '@/composables/useNotification';
import { ref, computed, onMounted } from 'vue';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  submittedAt: string;
  status: 'in_progress' | 'rejected' | 'accepted' | 'withdrawn';
}

const allApplications = ref<Application[]>([]);
const loading = ref(true);

const fetchApplications = async () => {
  loading.value = true;
  try {
    const envApiUrl = import.meta.env.VITE_API_URL;
    const response = await api.get(`${envApiUrl}/api/applications/my-applications`);

    if (!response.data) {
      notification.showMessage('Błąd podczas pobierania danych.', 'error');
      throw new Error('Błąd podczas pobierania danych');
    }

    allApplications.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchApplications();
});

const notification = useNotification();
const applications = computed(() => allApplications.value);

const currentPage = ref(1);
const perPage = 6;
const totalPages = computed(() => Math.ceil(applications.value.length / perPage) || 1);
const pageInput = ref(1);

const paginatedApps = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return applications.value.slice(start, start + perPage);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    pageInput.value = page;
  }
};

const goToPage = () => {
  if (!pageInput.value || pageInput.value < 1 || pageInput.value > totalPages.value) {
    pageInput.value = currentPage.value;
    return;
  }
  changePage(pageInput.value);
};

const { confirm } = useConfirm();

const withdraw = async (appId: string) => {
  const isConfirmed = await confirm(
    'Wycofanie aplikacji',
    'Czy na pewno chcesz wycofać tę aplikację? Tej operacji nie można cofnąć.',
    { confirmText: 'Tak, wycofaj', cancelText: 'Nie, wróć' },
  );

  if (isConfirmed) {
    try {
      const envApiUrl = import.meta.env.VITE_API_URL;
      await api.patch(`${envApiUrl}/api/applications/${appId}/status`, 'withdrawn', {
        headers: { 'Content-Type': 'application/json' },
      });

      const idx = allApplications.value.findIndex((a) => a.id === appId);
      if (idx !== -1) {
        allApplications.value[idx].status = 'withdrawn';
      }

      notification.showMessage('Aplikacja została wycofana.');
    } catch {
      notification.showMessage('Błąd podczas wycofywania aplikacji.', 'error');
    }
  }
};

const deleteApp = async (appId: string) => {
  const isConfirmed = await confirm(
    'Usuwanie aplikacji',
    'Czy na pewno chcesz usunąć tę aplikację z historii? Pozwoli Ci to na ponowne zaaplikowanie na to stanowisko.',
    { confirmText: 'Tak, usuń', cancelText: 'Nie, wróć' },
  );

  if (isConfirmed) {
    try {
      const envApiUrl = import.meta.env.VITE_API_URL;
      await api.delete(`${envApiUrl}/api/applications/${appId}`);

      allApplications.value = allApplications.value.filter((a) => a.id !== appId);

      notification.showMessage('Aplikacja została usunięta.');
    } catch {
      notification.showMessage('Błąd podczas usuwania aplikacji.', 'error');
    }
  }
};

const formatDate = (iso: string) => {
  if (!iso) {
    return '-';
  }

  const d = new Date(iso);
  return d.toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
};

const statusLabel = (status: Application['status']) => {
  const labels = {
    in_progress: 'W trakcie',
    rejected: 'Odrzucona',
    accepted: 'Przyjęta',
    withdrawn: 'Wycofana',
  };
  return labels[status] || 'Nieznany';
};

const statusClass = (status: Application['status']) => {
  const classes = {
    in_progress: 'badge-bg-primary',
    rejected: 'badge-bg-danger',
    accepted: 'badge-bg-success',
    withdrawn: 'badge-bg-warning',
  };
  return classes[status] || 'badge-bg-secondary';
};

const statusIcon = (status: Application['status']) => {
  const icons = {
    in_progress: 'fa-solid fa-hourglass-half',
    rejected: 'fa-solid fa-x',
    accepted: 'fa-solid fa-lightbulb',
    withdrawn: 'fa-regular fa-circle-left',
  };
  return icons[status] || 'fa-regular fa-circle-question';
};
</script>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(90deg, #ff5666, #e14b59);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app-card {
  transition: 0.25s ease;
}
.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.45em 0.8em;
  border-radius: 1rem;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.badge-bg-secondary {
  background-color: #6c757d;
}
.badge-bg-primary {
  background-color: #007bff;
}
.badge-bg-danger {
  background-color: #dc3545;
}
.badge-bg-success {
  background-color: #28a745;
}
.badge-bg-warning {
  background-color: #ffb400;
  color: #fff;
}

.btn-gradient {
  background: linear-gradient(90deg, #ff5666, #e14b59);
  color: white;
  border: none;
  height: 38px;
  padding: 5px 15px;
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

.page-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  transition: 0.2s;
}
.page-input:focus {
  outline: none;
  border-color: #ff5666;
  box-shadow: 0 0 0 2px rgba(255, 86, 102, 0.2);
}

.pagination-custom .btn {
  border-radius: 8px;
  font-weight: 600;
  min-width: 40px;
}
.pagination-custom .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
