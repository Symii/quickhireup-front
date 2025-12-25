<template>
  <section class="partners-slider">
    <div class="partners-track">
      <div class="partners-move" ref="moveContainer">
        <div class="partner" v-for="(partner, index) in displayPartners" :key="index">
          <img :src="partner.logo" :alt="partner.name" />
          <h3 class="partner-name">{{ partner.name }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

interface Partner {
  name: string;
  logo: string;
}

const partners = ref<Partner[]>([
  { name: 'Uniwersytet Pomorski', logo: 'upsl_profile.jpg' },
  { name: 'Witkac Software', logo: 'witkac_profile.svg' },
  { name: 'Kaliop Poland', logo: 'kaliop_profile.png' },
]);

const moveContainer = ref<HTMLElement | null>(null);

const displayPartners = computed(() => {
  const minItems = 12;
  let baseList = [...partners.value];

  while (baseList.length < minItems) {
    baseList = [...baseList, ...partners.value];
  }

  return [...baseList, ...baseList];
});

onMounted(async () => {
  await nextTick();

  const el = moveContainer.value;
  if (!el) return;

  const fullWidth = el.scrollWidth;
  if (fullWidth === 0) return;

  const speed = 50;
  const duration = fullWidth / 2 / speed;

  el.style.animationDuration = `${duration}s`;
});
</script>

<style scoped>
.partners-slider {
  overflow: hidden;
  padding: 2rem 0;
  width: 100%;
}

.partners-track {
  width: 100%;
}

.partners-move {
  display: flex;
  gap: 1rem;
  width: max-content;
  will-change: transform;
  animation: scroll 0s linear infinite;
}

.partners-move:hover {
  animation-play-state: paused;
}

.partner {
  flex-shrink: 0;
  width: 180px;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.partner img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  display: block;
}

.partner-name {
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
  word-break: break-word;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .partner {
    width: 140px;
    padding: 0.75rem;
  }
}
</style>
