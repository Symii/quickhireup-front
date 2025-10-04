<template>
  <div class="faq-card mb-3">
    <div class="faq-question" @click="toggle">
      <span>{{ item.question }}</span>

      <div :class="['faq-toggle', { open: isOpen }]" @click="toggle"></div>
    </div>

    <transition name="faq-slide">
      <div v-show="isOpen" class="faq-answer">
        <p>{{ item.answer }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  item: { question: string; answer: string };
  primaryColor: string;
}>();

const isOpen = ref(false);

const toggle = () => (isOpen.value = !isOpen.value);
</script>

<style scoped>
.faq-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.faq-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.faq-question {
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #444;
}

.faq-question i {
  font-size: 1rem;
  color: var(--primary);
  transition: transform 0.3s ease;
}

.faq-answer {
  padding: 0 1.5rem 1rem 1.5rem;
  color: #555;
  line-height: 1.5;
}

.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.3s ease;
}

.faq-slide-enter-from,
.faq-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.faq-slide-enter-to,
.faq-slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

.faq-toggle::before {
  content: '+';
  display: inline-block;
  width: 16px;
  text-align: center;
  font-weight: bold;
  margin-right: 8px;
  font-size: 20px;
  transition: transform 0.3s;
}

.faq-toggle.open::before {
  content: '-';
}
</style>
