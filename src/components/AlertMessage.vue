<template>
  <div
    v-if="isVisible"
    class="alert alert-info alert-dismissible fade show shadow-sm border-0 mb-4"
    role="alert"
  >
    <div class="d-flex align-items-center">
      <i class="fa-solid fa-circle-check me-2 fs-4"></i>

      <div>
        {{ message }}
      </div>
    </div>

    <button type="button" class="btn-close" @click="isVisible = false" aria-label="Close"></button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isVisible = ref(true);

defineProps<{ message: string }>();
</script>

<style scoped>
.alert-info {
  background-color: #e3f2fd;
  color: #0c5460;
  border-left: 5px solid #007bff !important;
}
</style>
