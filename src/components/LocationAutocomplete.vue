<template>
  <div class="search-input-wrapper position-relative" ref="wrapperRef">
    <label v-if="showLocationLabel">Lokalizacja</label>

    <div class="input-group">
      <input
        type="text"
        :value="modelValue"
        @input="onInput"
        @focus="onFocus"
        class="form-control"
        style="min-height: 45px !important"
        :placeholder="placeholder"
      />
      <span v-if="isLoading" class="input-group-text bg-white border-start-0">
        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
      </span>
    </div>

    <ul v-if="showSuggestions && suggestions.length > 0" class="location-suggestions shadow">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.place_id"
        @click="selectSuggestion(suggestion)"
        class="suggestion-item"
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

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Lokalizacja' },
  showLocationLabel: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'select']);

const suggestions = ref<NominatimSuggestion[]>([]);
const showSuggestions = ref(false);
const isLoading = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', value);

  if (debounceTimeout) clearTimeout(debounceTimeout);

  if (abortController) abortController.abort();

  if (value.length < 3) {
    suggestions.value = [];
    isLoading.value = false;
    return;
  }

  debounceTimeout = setTimeout(() => {
    fetchSuggestions(value);
  }, 500);
};

const fetchSuggestions = async (query: string) => {
  isLoading.value = true;

  abortController = new AbortController();
  const signal = abortController.signal;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query,
      )}&addressdetails=1&limit=5&countrycodes=pl`,
      {
        method: 'GET',
        signal: signal,
        headers: {
          'User-Agent': 'quickhireup/1.0 (qucikhireuo@gmail.pl)',
          'Accept-Language': 'pl-PL',
        },
      },
    );

    if (!response.ok) throw new Error('Błąd sieci');

    const data = await response.json();
    suggestions.value = data;
    showSuggestions.value = true;
  } catch {
    suggestions.value = [];
  } finally {
    isLoading.value = false;
    abortController = null;
  }
};

const onFocus = () => {
  if (props.modelValue.length >= 3 && suggestions.value.length > 0) {
    showSuggestions.value = true;
  }
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

.suggestion-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}
</style>
