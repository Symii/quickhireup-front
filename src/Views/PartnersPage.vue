<template>
  <section class="partners-page container py-5">
    <div class="quickhireup-title-wrapper text-center mb-4">
      <h2 class="quickhireup-main-title display-3 fw-bolder text-primary-gradient">QuickHireUp</h2>
    </div>

    <div class="logo-wrapper text-center mb-5">
      <img src="/quick-hire-up-logo.png" alt="QuickHireUp Logo" class="main-logo" />
    </div>

    <header class="text-center mb-5">
      <h1 class="display-4 fw-bold text-primary-gradient">Nasi Partnerzy</h1>

      <p class="text-muted">
        Współpracujemy z firmami, które tworzą przyszłość rynku pracy i technologii. Poznaj naszych
        partnerów i dowiedz się więcej o ich działaniach.
      </p>
    </header>

    <div class="partners-grid row g-4 mb-5">
      <div class="col-md-6 col-lg-4" v-for="partner in partners" :key="partner.name">
        <div class="card partner-card h-100 shadow-sm border-0">
          <div class="card-body text-center d-flex flex-column">
            <img :src="partner.logo" :alt="partner.name" class="partner-logo mb-3" />

            <h5 class="partner-name mb-2">{{ partner.name }}</h5>

            <p class="partner-description text-muted flex-grow-1">{{ partner.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <PartnersSlide />

    <section class="promo-partners mt-5">
      <div class="promo-content">
        <img src="https://cdn-icons-png.flaticon.com/512/2920/2920263.png" alt="Partnerzy" />

        <div>
          <h2>Dołącz do naszej sieci partnerów</h2>

          <p>
            Chcesz, aby Twoja firma była częścią naszej platformy? Skontaktuj się z nami i razem
            stwórzmy nowe możliwości dla kandydatów oraz przedsiębiorstw.
          </p>

          <RouterLink to="/kontakt" class="btn-generator">Skontaktuj się</RouterLink>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PartnersSlide from './Components/PartnersSlide.vue';

const partners = ref([
  {
    name: 'Uniwersytet Pomorski w Słupsku',
    logo: 'upsl_profile.jpg',
    description: 'Państwowa szkoła wyższa w Polsce z siedzibą w Słupsku.',
  },
  {
    name: 'Witkac Software',
    logo: 'witkac_profile.svg',
    description: 'Witkac to rozwiązanie dla nowoczesnego samorządu.',
  },
  {
    name: 'Kaliop Poland',
    logo: 'kaliop_profile.png',
    description:
      'Kaliop wspiera Cię w projektowaniu, rozwoju i wydajności Twojego cyfrowego ekosystemu.',
  },
]);
</script>

<style scoped>
.partners-page {
  font-family: 'Inter', Arial, sans-serif;
  background: var(--bg-light);
  color: var(--text);
}

.partners-page header h1 {
  font-size: 2.25rem;
}

.partners-page header p {
  font-size: 1rem;
  color: var(--text-muted);
}

.partners-grid .partner-card {
  background: var(--card);
  border-radius: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.partners-grid .partner-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.partner-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 auto;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
}

.partner-name {
  font-weight: 700;
  font-size: 1.1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.partner-description {
  font-size: 0.95rem;
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
  .promo-content {
    flex-direction: column;
    text-align: center;
  }

  .promo-content img {
    width: 120px;
  }

  header h1 {
    font-size: 1.75rem;
  }

  .main-logo {
    height: 140px;
    padding: 1rem;
  }

  .quickhireup-main-title {
    font-size: 2.5rem;
  }
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-logo {
  height: 200px;
  width: auto;
  object-fit: contain;

  background: #ffffff;
  border-radius: 2rem;
  border: 2px solid var(--border);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.main-logo:hover {
  transform: scale(1.02);
}

.quickhireup-title-wrapper {
  margin-bottom: 1.5rem;
}

.quickhireup-main-title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-top: 1rem;

  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style>
