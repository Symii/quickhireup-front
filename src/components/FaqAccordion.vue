<template>
  <div class="accordion" id="faqAccordion">
    <div class="accordion-item" v-for="(item, index) in items" :key="index">
      <h2 class="accordion-header" :id="'heading' + index">
        <button
          class="accordion-button"
          :class="{ collapsed: activeIndex !== index }"
          type="button"
          @click="toggle(index)"
          :aria-expanded="activeIndex === index ? 'true' : 'false'"
          :aria-controls="'collapse' + index"
          :style="{ color: primaryColor }"
        >
          {{ item.question }}
        </button>
      </h2>
      <div
        :id="'collapse' + index"
        class="accordion-collapse collapse"
        :class="{ show: activeIndex === index }"
        :aria-labelledby="'heading' + index"
        data-bs-parent="#faqAccordion"
      >
        <div class="accordion-body">
          {{ item.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  primaryColor: {
    type: String,
    default: '#ff5666',
  },
});

const activeIndex = ref(null);

function toggle(index) {
  activeIndex.value = activeIndex.value === index ? null : index;
}
</script>

<style scoped>
.accordion-button {
  font-weight: 600;
  font-size: 1.1rem;
  border-left: 5px solid var(--bs-primary);
  transition:
    color 0.3s ease,
    border-color 0.3s ease;
}

.accordion-button:not(.collapsed) {
  background-color: #ffe6e9;
  color: #ff5666 !important;
  border-left-color: #ff5666 !important;
}

.accordion-body {
  font-size: 1rem;
  color: #444;
}

:root {
  --bs-primary: #fc4c4e;
}
</style>
