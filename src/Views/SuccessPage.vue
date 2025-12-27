<template>
  <div class="success-container text-center mt-20">
    <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>

    <div class="success-card shadow-sm p-5">
      <div class="icon-wrapper mb-4">
        <i :class="['bi', icon]"></i>
      </div>

      <h1 class="mb-3">{{ title }}</h1>

      <p class="lead mb-4">
        {{ message }} <strong v-if="highlight">{{ highlight }}</strong>
      </p>

      <div class="d-flex justify-content-center gap-3">
        <button class="btn btn-primary" @click="onPrimaryClick">
          {{ primaryButtonText }}
        </button>

        <button class="btn btn-outline-secondary" @click="onSecondaryClick">
          {{ secondaryButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, defineComponent, type PropType } from 'vue';

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  dAlpha: number;
  color: string;
}

export default defineComponent({
  name: 'SuccessPage',
  props: {
    title: String,
    message: String,
    highlight: [String, Object] as PropType<string | null>,
    icon: String,
    primaryButtonText: String,
    secondaryButtonText: String,
    onPrimaryClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onSecondaryClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup() {
    const confettiCanvas = ref<HTMLCanvasElement | null>(null);
    let animationId: number;

    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.replace('#', ''), 16);
      return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
    };

    onMounted(() => {
      const canvas = confettiCanvas.value!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ['#ff5666', '#e14b59', '#ff8b9b', '#fff', '#ffd700', '#8affc1'];
      const stars: Star[] = [];

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
          if (s.alpha >= 1 || s.alpha <= 0) s.dAlpha = -s.dAlpha;
          s.y += 0.5;
          if (s.y > canvas.height) s.y = 0;
        });
      }

      function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
      }

      animate();
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    });

    onUnmounted(() => {
      cancelAnimationFrame(animationId);
    });

    return { confettiCanvas };
  },
});
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
  width: 90%;
  z-index: 2;
  transition: all 0.3s ease;
}

.success-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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
