<template>
  <div class="container mt-20">
    <header class="form-header text-center mb-5">
      <h1>Formularz opisu stanowiska</h1>

      <p class="lead">Wprowadź szczegóły stanowiska, aby wygenerować automatyczny opis pracy.</p>
    </header>

    <section class="form-content row justify-content-center">
      <div class="col-lg-5 mb-4">
        <div class="form-card shadow-sm p-4">
          <form @submit.prevent="submitForm" novalidate>
            <div class="mb-3">
              <label class="form-label">Tytuł stanowiska</label>

              <input
                type="text"
                v-model="form.jobTitle"
                placeholder="Np. Specjalista ds. marketingu"
                class="form-control"
                :class="{ 'is-invalid': errors.jobTitle }"
              />

              <div v-if="errors.jobTitle" class="invalid-feedback">
                Proszę podać tytuł stanowiska.
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Lokalizacja</label>

              <input
                type="text"
                v-model="form.location"
                placeholder="Np. Warszawa"
                class="form-control"
                :class="{ 'is-invalid': errors.location }"
              />

              <div v-if="errors.location" class="invalid-feedback">Proszę podać lokalizację.</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Doświadczenie</label>

              <select
                v-model="form.experience"
                class="form-control"
                :class="{ 'is-invalid': errors.experience }"
              >
                <option disabled value="">Wybierz doświadczenie</option>

                <option :value="1">Brak doświadczenia</option>

                <option :value="2">Do 1 roku</option>

                <option :value="3">1-3 lata</option>

                <option :value="4">3-5 lat</option>

                <option :value="5">Powyżej 5 lat</option>
              </select>

              <div v-if="errors.experience" class="invalid-feedback">
                Proszę wybrać doświadczenie.
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Rodzaj umowy</label>

              <select
                v-model="form.contractType"
                class="form-control"
                :class="{ 'is-invalid': errors.contractType }"
              >
                <option disabled value="">Wybierz rodzaj umowy</option>

                <option :value="1">Umowa o pracę</option>

                <option :value="2">Umowa zlecenie</option>

                <option :value="3">Umowa o dzieło</option>

                <option :value="4">Kontrakt B2B</option>
              </select>

              <div v-if="errors.contractType" class="invalid-feedback">
                Proszę wybrać rodzaj umowy.
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Rodzaj zatrudnienia</label>

              <select
                v-model="form.employmentType"
                class="form-control"
                :class="{ 'is-invalid': errors.employmentType }"
              >
                <option disabled value="">Wybierz rodzaj zatrudnienia</option>

                <option :value="1">Zdalnie</option>

                <option :value="2">Stacjonarnie</option>

                <option :value="3">Hybrydowo</option>
              </select>

              <div v-if="errors.employmentType" class="invalid-feedback">
                Proszę wybrać rodzaj zatrudnienia.
              </div>
            </div>

            <div class="text-end">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Generowanie...' : 'Wygeneruj opis stanowiska' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-lg-5 mb-4">
        <div class="form-card shadow-sm p-4 bg-light text-center">
          <h4>Instrukcja</h4>

          <p>
            Wprowadź dokładny tytuł stanowiska, lokalizację, doświadczenie, rodzaj umowy i
            zatrudnienia. Opis stanowiska zostanie wygenerowany automatycznie po kliknięciu
            przycisku.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712010.png"
            alt="Robot"
            class="robot-image mx-auto d-block mt-3"
          />
        </div>
      </div>
    </section>

    <div v-if="generating" class="mt-3 p-3 form-card shadow-sm bg-light text-center">
      <p>Trwa generowanie opisu...</p>

      <p>Czas oczekiwania: {{ formattedTime }}</p>

      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated custom-progress"
          role="progressbar"
        ></div>
      </div>
    </div>

    <section v-if="generatedDescription" class="mt-5">
      <h4>Aktualny wygenerowany opis</h4>

      <div class="form-card shadow-sm p-3 mb-3 bg-success-light">
        <pre class="generated-text">{{ generatedDescription }}</pre>

        <div class="text-end mt-2">
          <button @click="copyToClipboard" class="btn btn-generator">Kopiuj opis</button>
        </div>
      </div>
    </section>

    <section v-if="history.length" class="mt-5 mb-5">
      <h4>Historia wygenerowanych opisów</h4>

      <div
        v-for="item in history"
        :key="item.jobTitle + item.location + item.description"
        class="form-card shadow-sm p-3 mb-3 bg-light"
      >
        <strong>{{ item.jobTitle }} ({{ item.location }})</strong>

        <pre class="generated-text mt-2">{{ item.description }}</pre>
      </div>

      <nav class="mt-5 d-flex justify-content-center align-items-center gap-3 pagination-custom">
        <button
          class="btn btn-outline-primary"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          ‹
        </button>

        <div class="d-flex align-items-center gap-2">
          <input
            type="number"
            v-model.number="pageInput"
            @change="goToPage"
            class="form-control page-input"
            :min="1"
            :max="totalPages"
            style="width: 70px; text-align: center"
          />

          <span class="text-muted">z {{ totalPages }} stron</span>
        </div>

        <button
          class="btn btn-outline-primary"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          ›
        </button>
      </nav>
    </section>
  </div>
</template>

<script lang="ts">
interface History {
  jobTitle: string;
  location: string;
  description: string;
}

import api from '@/api/services/api';
import { computed, onMounted, reactive, ref, watch } from 'vue';

export default {
  setup() {
    const generating = ref(false);
    const elapsedTime = ref(0);
    let timer: number | undefined = undefined;

    const form = reactive({
      jobTitle: '',
      location: '',
      experience: null as number | null,
      contractType: null as number | null,
      employmentType: null as number | null,
    });

    const errors = reactive({
      jobTitle: false,
      location: false,
      experience: false,
      contractType: false,
      employmentType: false,
    });

    const loading = ref(false);
    const generatedDescription = ref('');
    const history = ref<History[]>([]);

    const itemsPerPage = 2;
    const currentPage = ref(1);

    const pageInput = ref(1);

    watch(currentPage, () => {
      pageInput.value = currentPage.value;
    });

    const changePage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchHistory(page);
      }
    };

    const goToPage = () => {
      if (!pageInput.value || pageInput.value < 1 || pageInput.value > totalPages.value) {
        pageInput.value = currentPage.value;
        return;
      }
      changePage(Number(pageInput.value));
    };

    const validateForm = () => {
      errors.jobTitle = !form.jobTitle;
      errors.location = !form.location;
      errors.experience = !form.experience;
      errors.contractType = !form.contractType;
      errors.employmentType = !form.employmentType;

      return !Object.values(errors).some(Boolean);
    };

    const submitForm = async () => {
      if (!validateForm()) return;

      loading.value = true;
      startTimer();

      try {
        const { data } = await api.post('/JobDescription/generate', form);

        generatedDescription.value = data.description || 'Brak opisu z serwera';

        history.value.unshift({
          jobTitle: form.jobTitle,
          location: form.location,
          description: generatedDescription.value,
        });
      } catch (error) {
        generatedDescription.value = `Wystąpił błąd: ${error}`;
      } finally {
        loading.value = false;
        stopTimer();
      }
    };

    const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedDescription.value);
      alert('Opis został skopiowany do schowka!');
    };

    const startTimer = () => {
      elapsedTime.value = 0;
      generating.value = true;
      timer = setInterval(() => {
        elapsedTime.value++;
      }, 1000);
    };

    const stopTimer = () => {
      generating.value = false;
      if (timer) clearInterval(timer);
    };

    const formattedTime = computed(() => {
      const minutes = Math.floor(elapsedTime.value / 60);
      const seconds = elapsedTime.value % 60;
      return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
    });

    const totalPages = ref(1);

    const fetchHistory = async (page = 1) => {
      try {
        const { data } = await api.get('/JobDescription/history', {
          params: { page, pageSize: itemsPerPage },
        });
        history.value = data.items;
        totalPages.value = data.totalPages;
      } catch (error) {
        console.error('Nie udało się pobrać historii:', error);
      }
    };

    onMounted(() => {
      fetchHistory();
    });

    return {
      form,
      errors,
      loading,
      generatedDescription,
      history,
      currentPage,
      totalPages,
      elapsedTime,
      generating,
      formattedTime,
      pageInput,
      goToPage,
      changePage,
      submitForm,
      copyToClipboard,
      startTimer,
      stopTimer,
    };
  },
};
</script>

<style scoped>
.form-header {
  background: linear-gradient(135deg, #ff5666, #e14b59);
  color: white;
  padding: 2.5rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.form-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.form-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

input.form-control,
select.form-control {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input.form-control:focus,
select.form-control:focus {
  border-color: #ff5666;
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.3);
}

button.btn-primary {
  background-color: #ff5666;
  border-color: #ff5666;
  font-weight: 600;
  padding: 12px 28px;
  font-size: 1.05rem;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

button.btn-primary:hover {
  background-color: #e14b59;
  border-color: #e14b59;
  box-shadow: 0 6px 20px rgba(225, 75, 89, 0.6);
}

.robot-image {
  max-width: 250px;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

.generated-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.bg-success-light {
  background-color: #e6ffed;
  border-left: 4px solid #28a745;
}

.progress {
  height: 20px;
  margin-top: 5px;
}

.custom-progress {
  background-color: var(--primary);
  width: 100%;
}

.mt-20 {
  margin-top: 20px;
}

.pagination .page-link {
  color: #ff5666;
}

.pagination .page-item.active .page-link {
  background-color: #ff5666;
  border-color: #ff5666;
  color: white;
}

.pagination-custom .btn {
  border-radius: 8px;
  font-weight: 600;
  min-width: 40px;
}

.pagination-custom .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.4rem 0.6rem !important;
  transition: 0.2s;
}

.page-input:focus {
  outline: none;
  border-color: #ff5666;
  box-shadow: 0 0 0 2px rgba(255, 86, 102, 0.2);
}

.btn-outline-primary {
  color: #ff5666;
  border-color: #ff5666;
}

.btn-outline-primary:hover {
  background-color: #ff5666;
  color: white;
  border-color: #ff5666;
}
</style>
