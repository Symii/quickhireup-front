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

      <p>Nie masz jeszcze żadnych aplikacji. Zacznij już teraz!</p>

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
import { ref, computed } from 'vue';

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  submittedAt: string;
  status: 'submitted' | 'in_progress' | 'rejected' | 'accepted' | 'withdrawn';
}

const allApplications = ref<Application[]>([
  {
    id: 1,
    jobId: 1,
    jobTitle: 'Frontend Developer',
    company: 'TechNova',
    location: 'Warszawa',
    type: 'Pełny etat',
    submittedAt: '2025-10-10T14:30:00Z',
    status: 'in_progress',
  },
  {
    id: 2,
    jobId: 4,
    jobTitle: 'DevOps Engineer',
    company: 'CloudOps',
    location: 'Zdalnie',
    type: 'Pełny etat',
    submittedAt: '2025-09-20T09:15:00Z',
    status: 'rejected',
  },
  {
    id: 3,
    jobId: 11,
    jobTitle: 'AI Engineer',
    company: 'FutureAI',
    location: 'Zdalnie',
    type: 'Pełny etat',
    submittedAt: '2025-10-15T12:45:00Z',
    status: 'accepted',
  },
]);

const applications = computed(() => allApplications.value);

const currentPage = ref(1);
const perPage = 6;
const totalPages = computed(() => Math.ceil(applications.value.length / perPage));
const pageInput = ref(1);

const paginatedApps = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return applications.value.slice(start, start + perPage);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToPage = () => {
  if (!pageInput.value || pageInput.value < 1 || pageInput.value > totalPages.value) {
    pageInput.value = currentPage.value;
    return;
  }
  changePage(pageInput.value);
};

const withdraw = (appId: number) => {
  if (confirm('Czy na pewno chcesz wycofać tę aplikację?')) {
    alert(`Aplikacja o id ${appId} została wycofana.`);
    const idx = allApplications.value.findIndex((a) => a.id === appId);
    if (idx !== -1) {
      allApplications.value[idx].status = 'withdrawn';
    }
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
};

const statusLabel = (status: Application['status']) => {
  switch (status) {
    case 'submitted':
      return 'Złożona';
    case 'in_progress':
      return 'W trakcie';
    case 'rejected':
      return 'Odrzucona';
    case 'accepted':
      return 'Przyjęta';
    case 'withdrawn':
      return 'Wycofana';
    default:
      return 'Nieznany';
  }
};

const statusClass = (status: Application['status']) => {
  switch (status) {
    case 'submitted':
      return 'badge-bg-secondary';
    case 'in_progress':
      return 'badge-bg-primary';
    case 'rejected':
      return 'badge-bg-danger';
    case 'accepted':
      return 'badge-bg-success';
    case 'withdrawn':
      return 'badge-bg-warning';
    default:
      return 'badge-bg-secondary';
  }
};

const statusIcon = (status: Application['status']) => {
  switch (status) {
    case 'submitted':
      return 'fa-regular fa-envelope';
    case 'in_progress':
      return 'fa-solid fa-hourglass-half';
    case 'rejected':
      return 'fa-solid fa-x';
    case 'accepted':
      return 'fa-solid fa-lightbulb';
    case 'withdrawn':
      return 'fa-regular fa-circle-left';
    default:
      return 'fa-regular fa-circle-question';
  }
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
