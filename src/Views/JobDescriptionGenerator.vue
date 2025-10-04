<template>
  <div class="container mt-20">
    <header class="form-header text-center mb-5">
      <h1>Formularz opisu stanowiska</h1>

      <p class="lead">Wprowadź szczegóły stanowiska, aby wygenerować automatyczny opis pracy.</p>
    </header>

    <section class="form-content row justify-content-center">
      <div class="col-md-5 mb-4">
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

                <option>Brak doświadczenia</option>

                <option>Do 1 roku</option>

                <option>1-3 lata</option>

                <option>3-5 lat</option>

                <option>Powyżej 5 lat</option>
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

                <option>Umowa o pracę</option>

                <option>Umowa zlecenie</option>

                <option>Umowa o dzieło</option>

                <option>Kontrakt B2B</option>
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

                <option>Zdalnie</option>

                <option>Stacjonarnie</option>

                <option>Hybrydowo</option>
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

      <div class="col-md-5">
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

      <p>Czas oczekiwania: {{ formattedTime }} / przewidywany 3 minuty</p>

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
        v-for="item in paginatedHistory"
        :key="item.jobTitle + item.location + item.description"
        class="form-card shadow-sm p-3 mb-3 bg-light"
      >
        <strong>{{ item.jobTitle }} ({{ item.location }})</strong>

        <pre class="generated-text mt-2">{{ item.description }}</pre>
      </div>

      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-outline-secondary" :disabled="currentPage === 1" @click="prevPage">
          Poprzednia strona
        </button>

        <span>Strona {{ currentPage }} z {{ totalPages }}</span>

        <button
          class="btn btn-outline-secondary"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Następna strona
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
interface History {
  jobTitle: string;
  location: string;
  description: string;
}

import { computed, reactive, ref } from 'vue';

export default {
  setup() {
    const generating = ref(false);
    const elapsedTime = ref(0);
    let timer: number | undefined = undefined;

    const form = reactive({
      jobTitle: '',
      location: '',
      experience: '',
      contractType: '',
      employmentType: '',
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
    const history = ref<History[]>([
      { jobTitle: 'Specjalista A', location: 'Warszawa', description: 'Opis A' },
      { jobTitle: 'Specjalista B', location: 'Kraków', description: 'Opis B' },
      { jobTitle: 'Specjalista C', location: 'Poznań', description: 'Opis C' },
      { jobTitle: 'Specjalista D', location: 'Gdańsk', description: 'Opis D' },
      { jobTitle: 'Specjalista E', location: 'Wrocław', description: 'Opis E' },
      { jobTitle: 'Specjalista F', location: 'Łódź', description: 'Opis F' },
    ]);

    const itemsPerPage = 5;
    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(history.value.length / itemsPerPage));

    const paginatedHistory = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return history.value.slice(start, end);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
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
        const response = await fetch('http://localhost:5000/api/JobDescription/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.statusText}`);
        }

        const data = await response.json();
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

    return {
      form,
      errors,
      loading,
      generatedDescription,
      history,
      currentPage,
      totalPages,
      paginatedHistory,
      elapsedTime,
      generating,
      formattedTime,
      nextPage,
      prevPage,
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
</style>
