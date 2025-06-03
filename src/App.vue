<template>
  <div>
    <Navbar v-if="showNavFooter" />

    <router-view />

    <Footer v-if="showNavFooter" />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showNavFooter = computed(() => {
  return !['/login', '/register', '/company-register'].includes(route.path);
});
</script>
