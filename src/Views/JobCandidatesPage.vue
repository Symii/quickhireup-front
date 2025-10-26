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
              <a :href="candidate.cvUrl" target="_blank" class="btn btn-outline-primary w-100">
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

interface Candidate {
  id: number;
  name: string;
  email: string;
  tel: string;
  experience: string;
  location: string;
  cvUrl: string;
  jobId: number;
}

interface Job {
  id: number;
  title: string;
}

const jobs: Job[] = [
  { id: 1, title: 'Frontend Developer' },
  { id: 3, title: 'UI/UX Designer' },
];

const allCandidates = ref<Candidate[]>([
  {
    id: 1,
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    tel: '123-456-789',
    experience: '3 lata',
    location: 'Warszawa',
    cvUrl: '/cv/jan_kowalski.pdf',
    jobId: 1,
  },
  {
    id: 2,
    name: 'Anna Nowak',
    email: 'anna.nowak@example.com',
    tel: '987-654-321',
    experience: '5 lat',
    location: 'Kraków',
    cvUrl: '/cv/anna_nowak.pdf',
    jobId: 1,
  },
  {
    id: 3,
    name: 'Piotr Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    tel: '555-666-777',
    experience: '2 lata',
    location: 'Gdańsk',
    cvUrl: '/cv/piotr_wisniewski.pdf',
    jobId: 3,
  },
]);

const route = useRoute();
const jobId = Number(route.params.jobId);

const jobTitle = computed(() => jobs.find((j) => j.id === jobId)?.title || 'Nieznane stanowisko');

const candidates = computed(() => allCandidates.value.filter((c) => c.jobId === jobId));
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
