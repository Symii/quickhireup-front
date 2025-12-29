<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="state.isOpen" class="modal-backdrop-custom" @click="triggerShake">
        <div class="modal-dialog-custom" :class="{ 'shake-anim': isShaking }" @click.stop>
          <div class="icon-wrapper mb-3">
            <i class="fa-solid fa-lightbulb text-warning fa-3x"></i>
          </div>

          <h4 class="fw-bold mb-2">{{ state.title }}</h4>

          <p class="text-muted mb-4">{{ state.message }}</p>

          <div class="d-flex justify-content-center gap-3 w-100">
            <button class="btn btn-outline-secondary px-4" @click="handleCancel">
              {{ state.cancelText }}
            </button>

            <button class="btn btn-gradient px-4" @click="handleConfirm">
              {{ state.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm';
import { ref } from 'vue';

const { state, handleConfirm, handleCancel } = useConfirm();

const isShaking = ref(false);

const triggerShake = () => {
  if (isShaking.value) {
    return;
  }

  isShaking.value = true;

  setTimeout(() => {
    isShaking.value = false;
  }, 400);
};
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog-custom {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: scale(1);
  transition: all 0.3s ease;
}

.btn-gradient {
  background: linear-gradient(90deg, #ff5666, #e14b59);
  color: white;
  border: none;
  font-weight: 500;
}
.btn-gradient:hover {
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active .modal-dialog-custom {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-leave-active .modal-dialog-custom {
  animation: popIn 0.3s reverse;
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.shake-anim {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: scale(1) translateX(0);
  }
  20%,
  60% {
    transform: scale(1) translateX(-6px);
  }
  40%,
  80% {
    transform: scale(1) translateX(6px);
  }
}
</style>
