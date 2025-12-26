<template>
  <div>
    <div class="notification-container">
      <TransitionGroup name="list">
        <div v-for="notif in notifications" :key="notif.id" :class="['small-box', notif.type]">
          <div class="content">
            <i :class="getIcon(notif.type)"></i>

            {{ notif.message }}
          </div>

          <div class="progress-bar" :style="{ animationDuration: notif.timeout + 'ms' }"></div>
        </div>
      </TransitionGroup>
    </div>

    <navbar-menu v-if="!$route.meta.hideNavFooter" />

    <router-view />

    <footer-menu v-if="!$route.meta.hideNavFooter" />
  </div>
</template>

<script setup lang="ts">
import NavbarMenu from './components/NavbarMenu.vue';
import FooterMenu from './components/FooterMenu.vue';
import { useNotification, type NotificationType } from './composables/useNotification';

const { notifications } = useNotification();

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'fas fa-circle-check';
    case 'error':
      return 'fas fa-circle-xmark';
    case 'info':
      return 'fa-solid fa-lightbulb';
    default:
      return 'fas fa-info-circle';
  }
};
</script>

<style>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.small-box {
  position: relative;
  overflow: hidden;
  color: white;
  padding: 1rem 1.2rem;
  padding-bottom: 1.5rem;
  border-radius: 0.4rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 300px;
}

.small-box.success {
  background-color: #28a745 !important;
}
.small-box.error {
  background-color: #dc3545 !important;
}
.small-box.info {
  background-color: #ecc800 !important;
  color: #333;
}

.content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 5px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4) !important;
  opacity: 0.9;
  transform-origin: left;
  animation: shrink linear forwards;
}

@keyframes shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
