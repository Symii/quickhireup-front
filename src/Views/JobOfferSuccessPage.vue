<template>
  <div class="success-container text-center mt-20">
    <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>

    <div class="success-card shadow-sm p-5">
      <div class="icon-wrapper mb-4">
        <i class="bi bi-check-circle-fill"></i>
      </div>

      <h1 class="mb-3">Zapisano ogłoszenie</h1>

      <p class="lead mb-4">
        Twoje ogłoszenie <strong>{{ jobTitle }}</strong> zostało zapisane i opublikowane.
      </p>

      <div class="d-flex justify-content-center gap-3">
        <button class="btn btn-primary" @click="goToOffer">Zobacz ogłoszenie</button>

        <button class="btn btn-outline-secondary" @click="goToHome">Wróć do listy ogłoszeń</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useRoute } from 'vue-router';

export default {
  name: 'SuccessPage',
  setup() {
    const route = useRoute();
    const offerId = route.query.offerId as string;
    const jobTitle = route.query.jobTitle as string;
    const router = useRouter();
    const confettiCanvas = ref<HTMLCanvasElement | null>(null);

    const goToOffer = () => router.push(`/oferta/${offerId}`);
    const goToHome = () => router.push('/');

    onMounted(() => {
      const canvas = confettiCanvas.value!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ['#ff5666', '#e14b59', '#ff8b9b', '#fff', '#ffd700', '#8affc1'];
      const stars: {
        x: number;
        y: number;
        r: number;
        alpha: number;
        dAlpha: number;
        color: string;
      }[] = [];

      for (let i = 0; i < 80; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 1,
          alpha: Math.random(),
          dAlpha: Math.random() * 0.02 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((s) => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hexToRgb(s.color)}, ${s.alpha})`;
          ctx.fill();

          s.alpha += s.dAlpha;
          if (s.alpha >= 1 || s.alpha <= 0) {
            s.dAlpha = -s.dAlpha;
          }
          s.y += 0.5;
          if (s.y > canvas.height) {
            s.y = 0;
          }
        });
      }

      function hexToRgb(hex: string) {
        const bigint = parseInt(hex.replace('#', ''), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
      }

      function animate() {
        draw();
        requestAnimationFrame(animate);
      }

      animate();
    });

    return { goToOffer, goToHome, confettiCanvas, jobTitle, offerId };
  },
};
</script>

<style scoped>
.success-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  overflow: hidden;
}

.confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.success-card {
  background: white;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  z-index: 2;
  transition: all 0.3s ease;
}

.success-card:hover {
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  font-size: 4rem;
  color: #ff5666;
  animation: pop 0.4s ease;
}

@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

button.btn-primary {
  background-color: #ff5666;
  border-color: #ff5666;
  transition: all 0.2s ease;
}

button.btn-primary:hover {
  background-color: #e14b59;
  border-color: #e14b59;
}

.mt-20 {
  margin-top: 20px;
}
</style>
