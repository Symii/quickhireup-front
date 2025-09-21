<template>
  <section class="partners-page container py-5">
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

    <section class="partners-slider mb-5">
      <div class="partners-track" ref="track">
        <div
          class="partner"
          v-for="(partner, index) in partners.concat(partners)"
          :key="index + '-' + partner.name"
        >
          <img :src="partner.logo" :alt="partner.name" />

          <h3 class="partner-name">{{ partner.name }}</h3>
        </div>
      </div>
    </section>

    <section class="promo-partners mt-5">
      <div class="promo-content">
        <img src="https://cdn-icons-png.flaticon.com/512/2920/2920263.png" alt="Partnerzy" />

        <div>
          <h2>Dołącz do naszej sieci partnerów</h2>

          <p>
            Chcesz, aby Twoja firma była częścią naszej platformy? Skontaktuj się z nami i razem
            stwórzmy nowe możliwości dla kandydatów oraz przedsiębiorstw.
          </p>

          <a href="/kontakt" class="btn-generator">📩 Skontaktuj się</a>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const partners = ref([
  {
    name: 'WorkPro',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    description: 'Lider wśród agencji rekrutacyjnych IT.',
  },
  {
    name: 'HireNow',
    logo: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
    description: 'Innowacyjne podejście do zatrudniania.',
  },
  {
    name: 'DevTalent',
    logo: 'https://cdn-icons-png.flaticon.com/512/921/921347.png',
    description: 'Specjalizacja w rekrutacji programistów.',
  },
  {
    name: 'PeopleFirst',
    logo: 'https://cdn-icons-png.flaticon.com/512/2972/2972558.png',
    description: 'Partner HR dla nowoczesnych firm.',
  },
  {
    name: 'SkillMatch',
    logo: 'https://cdn-icons-png.flaticon.com/512/4363/4363898.png',
    description: 'Łączymy umiejętności z możliwościami.',
  },
  {
    name: 'FutureHire',
    logo: 'https://cdn-icons-png.flaticon.com/512/3182/3182584.png',
    description: 'Tworzymy przyszłość rynku pracy.',
  },
  {
    name: 'TalentBridge',
    logo: 'https://cdn-icons-png.flaticon.com/512/3405/3405870.png',
    description: 'Most między firmami a talentami.',
  },
  {
    name: 'NextStep',
    logo: 'https://cdn-icons-png.flaticon.com/512/3468/3468330.png',
    description: 'Twój kolejny krok w karierze.',
  },
  {
    name: 'CareerBoost',
    logo: 'https://cdn-icons-png.flaticon.com/512/1048/1048941.png',
    description: 'Przyspiesz swoją ścieżkę zawodową.',
  },
]);

const track = ref<HTMLElement | null>(null);

onMounted(() => {
  const scrollStep = 0.5;

  function autoScroll() {
    const el = track.value;
    if (!el) return;

    el.scrollLeft += scrollStep;

    if (el.scrollLeft >= el.scrollWidth / 2) {
      el.scrollLeft = 0;
    }

    requestAnimationFrame(autoScroll);
  }

  requestAnimationFrame(autoScroll);
});
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
}

.partner-description {
  font-size: 0.95rem;
}

.partners-slider {
  background: var(--bg-light);
  padding: 2rem 0;
  overflow: hidden;
}

.partners-track {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: 10px 0;
}

.partners-track::-webkit-scrollbar {
  display: none;
}

.partners-track .partner {
  flex: 0 0 auto;
  width: 160px;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  box-shadow: var(--shadow);
}

.partners-track img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 0.5rem;
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
}
</style>
