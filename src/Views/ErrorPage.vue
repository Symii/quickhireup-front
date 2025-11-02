<template>
  <div class="error-container text-center mt-20">
    <canvas ref="bgCanvas" class="bg-canvas"></canvas>

    <div class="error-card shadow-sm p-5">
      <div class="icon-wrapper mb-4" :class="iconColor">
        <i :class="iconClass"></i>
      </div>

      <h1 class="mb-3">{{ title }}</h1>

      <p class="lead mb-4">
        {{ message }}
      </p>

      <div class="d-flex justify-content-center">
        <button class="btn btn-generator" @click="goHome">Wróć na stronę główną</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ErrorPage',
  props: {
    type: { type: String, default: '401' },
    message: { type: String, default: 'Brak dostępu do tej strony.' },
  },
  setup(props) {
    const router = useRouter();
    const bgCanvas = ref<HTMLCanvasElement | null>(null);

    const goHome = () => router.push('/');

    const title = computed(() => {
      switch (props.type) {
        case '401':
        case '403':
          return 'Brak dostępu';
        case '500':
          return 'Błąd serwera';
        default:
          return 'Wystąpił błąd';
      }
    });

    const iconClass = computed(() => {
      return 'fa-solid fa-face-frown';
    });

    const iconColor = computed(() => {
      return 'error-icon-denied';
    });

    onMounted(() => {
      const canvas = bgCanvas.value!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const circles: { x: number; y: number; r: number; speed: number }[] = [];

      for (let i = 0; i < 40; i++) {
        circles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 60 + 20,
          speed: Math.random() * 0.4 + 0.1,
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        circles.forEach((c) => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 86, 102, 0.08)';
          ctx.fill();
          c.y += c.speed;
          if (c.y - c.r > canvas.height) {
            c.y = -c.r;
          }
        });
      }

      function animate() {
        draw();
        requestAnimationFrame(animate);
      }

      animate();
    });

    return { goHome, bgCanvas, title, iconClass, iconColor };
  },
};
</script>

<style scoped>
.error-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  overflow: hidden;
}

.bg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.error-card {
  background: white;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  z-index: 2;
}

.icon-wrapper {
  font-size: 4rem;
  animation: pulse 1.2s infinite ease-in-out;
}

.error-icon-denied {
  color: #ff5666;
}

.error-icon-warning {
  color: #ffb400;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
</style>
