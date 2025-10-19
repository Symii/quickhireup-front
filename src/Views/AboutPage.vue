<template>
  <div class="about-page container py-5">
    <header class="about-header text-center mb-5">
      <h1>O nas</h1>

      <p class="lead">
        Jesteśmy platformą łączącą najlepsze oferty pracy z utalentowanymi kandydatami.
      </p>
    </header>

    <section class="values-section mb-5">
      <div class="row text-center">
        <div class="col-md-4 mb-4" v-for="value in values" :key="value.title">
          <div class="value-card p-4 h-100">
            <i :class="value.icon + ' fa-2x mb-3 text-primary value-icon'"></i>

            <h3>{{ value.title }}</h3>

            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section mb-5">
      <h2 class="text-center mb-4">Poznaj nasz zespół</h2>

      <div class="row justify-content-center">
        <div v-for="member in team" :key="member.id" class="col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="team-card h-100 text-center p-3 shadow-sm">
            <img
              :src="member.photo"
              :alt="member.name"
              class="rounded-circle mb-3 about-team-img"
            />

            <h4>{{ member.name }}</h4>

            <p class="text-muted">{{ member.role }}</p>

            <div class="social-icons mt-2">
              <i class="fa-brands fa-linkedin fa-lg me-2"></i>

              <i class="fa-brands fa-twitter fa-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="history-section mb-5">
      <h2 class="text-center mb-4">Nasza historia</h2>

      <div class="timeline">
        <div v-for="event in history" :key="event.year" class="timeline-event">
          <div class="timeline-dot"></div>

          <div class="timeline-content">
            <h5>{{ event.year }}</h5>

            <p>{{ event.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="promo-partners mt-5">
      <div class="promo-content">
        <img src="https://cdn-icons-png.flaticon.com/512/2920/2920263.png" alt="Partnerzy" />

        <div>
          <h2>Dołącz do nas już dziś</h2>

          <p class="mb-4">
            Jeśli jesteś firmą szukającą talentów lub kandydatem szukającym nowych możliwości -
            jesteśmy tu dla Ciebie.
          </p>

          <a href="/kontakt" class="btn-generator">📩 Skontaktuj się</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const values = ref([
  {
    title: 'Innowacyjność',
    description:
      'Stale rozwijamy naszą platformę, by oferować nowoczesne rozwiązania i usprawnienia',
    icon: 'fa-solid fa-lightbulb',
  },
  {
    title: 'Bezpieczeństwo',
    description: 'Najwyższe standardy ochrony danych i prywatności naszych użytkowników',
    icon: 'fa-solid fa-user',
  },
  {
    title: 'Rozwój',
    description:
      'Wsparcie rozwoju - zarówno zawodowego, jak i osobistego - dla każdego użytkownika naszej platformy',
    icon: 'fa-solid fa-paper-plane',
  },
]);

const team = ref([
  {
    id: 1,
    name: 'Szymon Ulatowski',
    role: 'CEO',
    photo: 'ceo.jpeg',
  },
  {
    id: 2,
    name: 'Szymon Ulatowski',
    role: 'Lead Developer',
    photo: 'ceo.jpeg',
  },
  {
    id: 3,
    name: 'Szymon Ulatowski',
    role: 'Marketing',
    photo: 'ceo.jpeg',
  },
]);

const history = ref([
  { year: 2025, text: 'Platforma została założona przez pasjonatów technologii' },
  {
    year: 2026,
    text: 'Generowanie opisów ogłoszeń o pracę przez sztuczną inteligencję',
  },
  { year: 2027, text: 'Rozbudowa platformy i partnerstwa z firmami' },
  { year: 2028, text: 'Obsługa setek ofert miesięcznie i rosnąca społeczność' },
]);
</script>

<style scoped>
.about-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 4rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 3rem;
}
.about-header h1 {
  font-size: 3rem;
  font-weight: 700;
}
.about-header .lead {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 1rem auto 0 auto;
}

.values-section .value-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.values-section .value-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
.value-icon {
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}
.value-card:hover .value-icon {
  transform: rotate(15deg) scale(1.2);
  color: #ffdd57;
}

.about-team-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid var(--primary);
  transition: transform 0.3s ease;
}
.team-card {
  background: white;
  border-radius: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}
.team-card:hover .about-team-img {
  transform: scale(1.1);
}
.social-icons i {
  color: var(--primary);
  transition: color 0.3s;
}
.social-icons i:hover {
  color: var(--primary-dark);
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding-left: 2rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary), var(--primary-dark));
  border-radius: 2px;
}
.timeline-event {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 2rem;
}
.timeline-dot {
  position: absolute;
  left: 12px;
  top: 0;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 4px solid var(--primary);
  border-radius: 50%;
}
.timeline-content h5 {
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: var(--primary);
}
.timeline-content p {
  margin: 0;
  color: #333;
}

.promo-partners {
  background: var(--bg-light);
  padding: 2.5rem 1rem;
  border-top: 1px solid var(--border);
}

.promo-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

.promo-content img {
  width: 160px;
  height: auto;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.promo-content div {
  max-width: 600px;
}

@media (max-width: 768px) {
  .history-section p,
  .timeline {
    padding: 0 1rem;
  }
  .about-header h1 {
    font-size: 2.25rem;
  }
}
</style>
