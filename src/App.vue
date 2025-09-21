<template>
  <Transition name="fade">
    <div v-if="visible" class="small-box">
      <i class="fas fa-circle-check icon"></i>

      {{ message }}
    </div>
  </Transition>

  <div>
    <navbar-menu v-if="!$route.meta.hideNavFooter" />

    <router-view />

    <footer-menu v-if="!$route.meta.hideNavFooter" />
  </div>
</template>

<script setup lang="ts">
import NavbarMenu from './components/NavbarMenu.vue';
import FooterMenu from './components/FooterMenu.vue';

import { useNotification } from './composables/useNotification';
import { useAuth } from '@/composables/useAuth';
import { onMounted } from 'vue';

const { message, visible } = useNotification();
const { initAuth } = useAuth();

onMounted(() => {
  initAuth();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.small-box {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #28702a;
  color: white;
  padding: 1rem 1.2rem;
  border-radius: 0.4rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
}

.small-box .icon {
  font-size: 1.2rem;
}
</style>
