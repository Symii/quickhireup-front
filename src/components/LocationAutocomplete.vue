<template>
  <div class="search-input-wrapper position-relative" ref="wrapperRef">
    <input
      type="text"
      :value="modelValue"
      @input="onInput"
      @focus="showSuggestions = true"
      class="form-control"
      :placeholder="placeholder"
    />

    <ul v-if="showSuggestions && suggestions.length > 0" class="location-suggestions shadow">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.place_id"
        @click="selectSuggestion(suggestion)"
      >
        <MapPinIcon class="icon" />

        {{ suggestion.display_name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { MapPinIcon } from '@heroicons/vue/24/solid';

interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Lokalizacja' },
});

const emit = defineEmits(['update:modelValue', 'select']);

const suggestions = ref<NominatimSuggestion[]>([]);
const showSuggestions = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', value);

  if (debounceTimeout) clearTimeout(debounceTimeout);

  if (value.length < 3) {
    suggestions.value = [];
    return;
  }

  debounceTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value,
        )}&addressdetails=1&limit=5&countrycodes=pl`,
      );
      const data = await response.json();
      suggestions.value = data;
      showSuggestions.value = true;
    } catch (error) {
      console.error('Błąd pobierania lokalizacji:', error);
    }
  }, 400);
};

const selectSuggestion = (suggestion: NominatimSuggestion) => {
  emit('update:modelValue', suggestion.display_name);
  emit('select', suggestion);
  showSuggestions.value = false;
  suggestions.value = [];
};

const closeSuggestions = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    showSuggestions.value = false;
  }
};

onMounted(() => window.addEventListener('click', closeSuggestions));
onUnmounted(() => window.removeEventListener('click', closeSuggestions));
</script>

<style scoped>
.icon {
  width: 18px;
  height: 18px;
  color: #6c757d;
}

.search-input-wrapper {
  flex: 1;
}

.location-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  list-style: none;
  padding: 0;
  margin-top: 5px;
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #ddd;
}

.location-suggestions li {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
  text-align: left;
}

.location-suggestions li:last-child {
  border-bottom: none;
}

.location-suggestions li:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.search-form input {
  width: 100%;
}

.form-control {
  height: 100%;
}
</style>
