<template>
  <div class="container mt-20">
    <header class="employers-header text-center mb-5">
      <h1>Profile pracodawców</h1>

      <p class="lead">Przeglądaj i poznaj pracodawców, z którymi możesz nawiązać współpracę.</p>
    </header>

    <section class="employers-content row">
      <template v-if="employers.length">
        <div v-for="employer in employers" :key="employer.id" class="col-md-4 mb-4">
          <div class="employer-card shadow-sm p-4 text-center">
            <div class="employer-logo-wrapper mb-3">
              <div v-if="!employer.logo" class="company-icon">
                {{ employer.name[0] }}
              </div>

              <img v-else :src="employer.logo" :alt="employer.name" class="employer-logo" />
            </div>

            <h5 class="mb-1">{{ employer.name }}</h5>

            <p class="text-muted mb-1">{{ employer.industry }}</p>

            <p class="text-muted small mb-3">{{ employer.location }}</p>

            <p class="text-muted small">{{ employer.description }}</p>

            <div class="mt-3">
              <RouterLink :to="employer.profileUrl">
                <button :href="employer.profileUrl" class="btn btn-generator btn-sm">
                  Zobacz profil
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="col-12 empty-state text-center mb-5">
          <i class="fa-solid fa-building fa-3x mb-3" style="color: #ff5666"></i>

          <h4 class="mb-2">Brak dostępnych profili pracodawców</h4>

          <p class="text-muted mb-3">
            Nie znaleziono żadnych pracodawców. Spróbuj później lub sprawdź inne zakładki.
          </p>

          <a href="/jobs" class="btn btn-generator btn-sm">Przejdź do ofert pracy</a>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Employer {
  id: number;
  name: string;
  industry: string;
  location: string;
  description: string;
  logo?: string;
  profileUrl: string;
}

const employers = ref<Employer[]>([
  {
    id: 1,
    name: 'TechNova',
    industry: 'IT / Software',
    location: 'Warszawa',
    description: 'Firma tworząca nowoczesne aplikacje webowe i mobilne.',
    logo: '',
    profileUrl: '/profil-pracodwawcy/1',
  },
  {
    id: 2,
    name: 'CodeWave',
    industry: 'IT / Software',
    location: 'Zdalnie',
    description: 'Specjalizacja w backendzie i rozwoju systemów cloud.',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    profileUrl: '/profil-pracodwawcy/2',
  },
]);
</script>

<style scoped>
.employers-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 2.5rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.employer-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  padding: 2rem 1rem;
}

.employer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.employer-logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.employer-logo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--primary);
  background: var(--bg-light);
}

.company-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

h5 {
  font-weight: 600;
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
