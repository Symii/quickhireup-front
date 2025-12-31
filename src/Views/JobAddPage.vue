<template>
  <div class="container mt-20">
    <header class="form-header text-center mb-5">
      <h1>{{ pageTitle }}</h1>

      <p class="lead">
        {{
          isEditMode
            ? 'Zaktualizuj dane swojego ogłoszenia.'
            : 'Wypełnij formularz krok po kroku, aby opublikować ogłoszenie.'
        }}
      </p>
    </header>

    <section class="row justify-content-center">
      <div class="col-lg-6 mb-4">
        <div class="form-card shadow-sm p-4">
          <div class="steps mb-4">
            <div v-for="n in 3" :key="n" class="step" :class="{ active: currentStep === n }">
              <span class="step-number">{{ n }}</span>

              <span class="step-label">{{ stepLabels[n - 1] }}</span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit">
            <div v-if="currentStep === 1">
              <h4 class="mb-3">Dane podstawowe</h4>

              <div class="mb-3 position-relative">
                <label class="form-label">Wyszukaj i wybierz szablon</label>

                <div class="input-group">
                  <span class="input-group-text"><i class="fa-brands fa-searchengin"></i></span>

                  <input
                    type="text"
                    class="form-control"
                    placeholder="Wpisz nazwę szablonu..."
                    v-model="templateSearchQuery"
                    @focus="showTemplateDropdown = true"
                  />
                </div>

                <ul
                  v-if="showTemplateDropdown && filteredTemplates.length > 0"
                  class="list-group position-absolute w-100 shadow-sm z-3"
                  style="max-height: 200px; overflow-y: auto"
                >
                  <li
                    class="list-group-item list-group-item-action cursor-pointer"
                    @click="applyTemplate(null)"
                  >
                    <em>Brak (wyczyść pola)</em>
                  </li>

                  <li
                    v-for="tpl in filteredTemplates"
                    :key="tpl.id"
                    class="list-group-item list-group-item-action cursor-pointer"
                    @click="applyTemplate(tpl)"
                  >
                    <strong>{{ tpl.name }}</strong> <br />

                    <small class="text-muted">{{ tpl.jobTitle }}</small>
                  </li>
                </ul>
              </div>

              <div class="mb-3">
                <label class="form-label">Tytuł stanowiska</label>

                <input
                  type="text"
                  v-model="form.jobTitle"
                  :class="['form-control', { 'is-invalid': errors.jobTitle }]"
                />

                <div class="invalid-feedback">{{ errors.jobTitle }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Firma</label>

                <input
                  type="text"
                  v-model="form.company"
                  :class="['form-control', { 'is-invalid': errors.company }]"
                />

                <div class="invalid-feedback">{{ errors.company }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Lokalizacja</label>

                <LocationAutocomplete
                  v-model="form.location"
                  class="additional-padding"
                  :class="[{ 'is-invalid': errors.location }]"
                />

                <div class="invalid-feedback">{{ errors.location }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Rodzaj zatrudnienia</label>

                <select
                  v-model="form.employmentType"
                  :class="['form-control', { 'is-invalid': errors.employmentType }]"
                >
                  <option disabled value="">Wybierz</option>

                  <option>Zdalnie</option>

                  <option>Stacjonarnie</option>

                  <option>Hybrydowo</option>
                </select>

                <div class="invalid-feedback">{{ errors.employmentType }}</div>
              </div>

              <div class="text-end">
                <button class="btn btn-primary" type="button" @click="nextStep">Dalej →</button>
              </div>
            </div>

            <div v-if="currentStep === 2">
              <h4 class="mb-3">Szczegóły stanowiska</h4>

              <div class="mb-3">
                <label class="form-label">Doświadczenie</label>

                <select
                  v-model="form.experience"
                  :class="['form-control', { 'is-invalid': errors.experience }]"
                >
                  <option disabled value="">Wybierz doświadczenie</option>

                  <option>Brak doświadczenia</option>

                  <option>Do 1 roku</option>

                  <option>1-3 lata</option>

                  <option>3-5 lat</option>

                  <option>Powyżej 5 lat</option>
                </select>

                <div class="invalid-feedback">{{ errors.experience }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Rodzaj umowy</label>

                <select
                  v-model="form.contractType"
                  :class="['form-control', { 'is-invalid': errors.contractType }]"
                >
                  <option disabled value="">Wybierz rodzaj umowy</option>

                  <option>Umowa o pracę</option>

                  <option>Umowa zlecenie</option>

                  <option>Umowa o dzieło</option>

                  <option>Kontrakt B2B</option>
                </select>

                <div class="invalid-feedback">{{ errors.contractType }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Wynagrodzenie OD</label>

                <input
                  type="number"
                  v-model="form.salaryFrom"
                  placeholder="Np. 6000"
                  :class="['form-control', { 'is-invalid': errors.salaryFrom }]"
                />

                <div class="invalid-feedback">{{ errors.salaryFrom }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Wynagrodzenie DO</label>

                <input
                  type="number"
                  v-model="form.salaryTo"
                  placeholder="Np. 8000"
                  :class="['form-control', { 'is-invalid': errors.salaryTo }]"
                />

                <div class="invalid-feedback">{{ errors.salaryTo }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Opis stanowiska</label>

                <textarea
                  v-model="form.description"
                  rows="3"
                  :class="['form-control', { 'is-invalid': errors.description }]"
                ></textarea>

                <div class="invalid-feedback">{{ errors.description }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Wymagania</label>

                <textarea
                  v-model="form.qualifications"
                  rows="3"
                  :class="['form-control', { 'is-invalid': errors.qualifications }]"
                ></textarea>

                <div class="invalid-feedback">{{ errors.qualifications }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Oferujemy <small>(opcjonalnie)</small></label>

                <textarea v-model="form.benefits" rows="3" :class="['form-control']"></textarea>
              </div>

              <div class="text-end">
                <button class="btn btn-outline-secondary me-2" type="button" @click="prevStep">
                  ← Wstecz
                </button>

                <button class="btn btn-primary" type="button" @click="nextStep">Dalej →</button>
              </div>
            </div>

            <div v-if="currentStep === 3">
              <h4 class="mb-3">Podsumowanie</h4>

              <div class="preview bg-light p-3 rounded">
                <h5>{{ form.jobTitle }} – {{ form.company }}</h5>

                <p><strong>Lokalizacja:</strong> {{ form.location }}</p>

                <p><strong>Rodzaj pracy:</strong> {{ form.employmentType }}</p>

                <p><strong>Doświadczenie:</strong> {{ form.experience }}</p>

                <p><strong>Umowa:</strong> {{ form.contractType }}</p>

                <p><strong>Wynagrodzenie od:</strong> {{ form.salaryFrom }}</p>

                <p><strong>Wynagrodzenie do:</strong> {{ form.salaryTo }}</p>

                <hr />

                <p><strong>Opis stanowiska:</strong><br />{{ form.description }}</p>

                <p><strong>Wymagania:</strong><br />{{ form.qualifications }}</p>

                <p v-if="form.benefits"><strong>Oferujemy:</strong><br />{{ form.benefits }}</p>
              </div>

              <div class="form-check mt-3">
                <input
                  type="checkbox"
                  v-model="form.agreeRegulation"
                  class="custom-checkbox"
                  id="agree"
                />

                <label for="agree" class="form-check-label">Akceptuję regulamin publikacji</label>

                <div v-if="errors.agreeRegulation" class="text-danger small mt-1">
                  {{ errors.agreeRegulation }}
                </div>
              </div>

              <div class="text-end mt-3">
                <button class="btn btn-outline-secondary me-2" type="button" @click="prevStep">
                  ← Wstecz
                </button>

                <button class="btn btn-primary" type="submit" :disabled="loading">
                  {{ loading ? 'Zapisywanie...' : 'Zapisz ogłoszenie' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="col-lg-4 mb-4">
        <div class="form-card shadow-sm p-4 bg-light">
          <h4>Instrukcja – {{ stepLabels[currentStep - 1] }}</h4>

          <p v-html="instructions[currentStep - 1]"></p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import api from '@/api/services/api';
import jobOfferService from '@/api/services/jobOfferService';
import type { JobOffer } from '@/api/types/jobOffer';
import LocationAutocomplete from '@/components/LocationAutocomplete.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useNotification } from '@/composables/useNotification';
import router from '@/router';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

interface JobTemplate {
  id: string;
  name: string;
  jobTitle: string;
  experience: string;
  contractType: string;
  employmentType: string;
  salaryFrom: number;
  salaryTo: number;
  description: string;
  qualifications: string;
  benefits?: string;
}

export default {
  components: {
    LocationAutocomplete,
  },
  setup() {
    const notification = useNotification();
    const route = useRoute();
    const currentStep = ref(1);
    const loading = ref(false);

    const templates = ref<JobTemplate[]>([]);
    const templateSearchQuery = ref('');
    const showTemplateDropdown = ref(false);
    const envApiUrl = import.meta.env.VITE_API_URL;
    const apiUrlTemplates = `${envApiUrl}/api/JobTemplates`;

    const fetchTemplates = async () => {
      try {
        const response = await api.get(apiUrlTemplates);
        if (response.status === 200) {
          templates.value = response.data;
        }
      } catch (error) {
        console.error('Błąd pobierania szablonów:', error);
      }
    };

    const filteredTemplates = computed(() => {
      if (!templateSearchQuery.value) return templates.value;
      const query = templateSearchQuery.value.toLowerCase();
      return templates.value.filter(
        (t) => t.name.toLowerCase().includes(query) || t.jobTitle.toLowerCase().includes(query),
      );
    });

    const applyTemplate = (tpl: JobTemplate | null) => {
      if (tpl) {
        form.jobTitle = tpl.jobTitle;
        form.experience = tpl.experience;
        form.contractType = tpl.contractType;
        form.employmentType = tpl.employmentType;
        form.salaryFrom = tpl.salaryFrom;
        form.salaryTo = tpl.salaryTo;
        form.description = tpl.description;
        form.qualifications = tpl.qualifications;
        form.benefits = tpl.benefits || '';
        templateSearchQuery.value = tpl.name;
      } else {
        templateSearchQuery.value = '';
        form.jobTitle = '';
        form.experience = '';
        form.contractType = '';
        form.employmentType = '';
        form.salaryFrom = 0;
        form.salaryTo = 0;
        form.description = '';
        form.qualifications = '';
        form.benefits = '';
        templateSearchQuery.value = '';
      }
      showTemplateDropdown.value = false;
    };

    const isEditMode = computed(() => !!route.params.id);
    const offerId = route.params.id as string;

    const pageTitle = computed(() =>
      isEditMode.value ? 'Edytuj ogłoszenie' : 'Dodaj ogłoszenie o pracę',
    );

    const stepLabels = ['Dane podstawowe', 'Szczegóły stanowiska', 'Podsumowanie'];

    const selectedTemplate = ref('');
    const errors = reactive<Record<string, string>>({});

    const form = reactive<Partial<JobOffer>>({
      userId: '',
      jobTitle: '',
      company: '',
      location: '',
      employmentType: '',
      experience: '',
      contractType: '',
      salaryTo: 0,
      salaryFrom: 0,
      description: '',
      qualifications: '',
      agreeRegulation: false,
      longitude: undefined,
      latitude: undefined,
    });

    const validateStep = (step: number): boolean => {
      Object.keys(errors).forEach((k) => (errors[k] = ''));

      if (step === 1) {
        if (!form.jobTitle) errors.jobTitle = 'Błąd: Proszę podać tytuł stanowiska.';
        if (!form.company) errors.company = 'Błąd: Proszę podać nazwę firmy.';
        if (!form.location || !form.longitude || !form.latitude)
          errors.location = 'Błąd: Proszę podać lokalizację.';
        if (!form.employmentType)
          errors.employmentType = 'Błąd: Proszę wybrać rodzaj zatrudnienia.';
      }

      if (step === 2) {
        if (!form.experience) errors.experience = 'Błąd: Proszę wybrać poziom doświadczenia.';
        if (!form.contractType) errors.contractType = 'Błąd: Proszę wybrać rodzaj umowy.';
        if ((form.salaryFrom ?? 0) < 0) {
          errors.salaryFrom = 'Błąd: Proszę podać wynagrodzenie.';
        }

        const sFrom = form.salaryFrom ?? 0;
        const sTo = form.salaryTo ?? 0;

        if (sTo < sFrom) {
          errors.salaryTo = `Błąd: Wynagrodzenie DO musi być większe niż ${sFrom}.`;
        }
        if (!form.description) errors.description = 'Błąd: Proszę wpisać opis stanowiska.';
        if (!form.qualifications) errors.qualifications = 'Błąd: Proszę podać wymagania.';
      }

      if (step === 3 && !form.agreeRegulation)
        errors.agreeRegulation = 'Błąd: Musisz zaakceptować regulamin.';

      const isValid = Object.values(errors).every((v) => !v);

      if (!isValid) {
        notification.showMessage('Proszę poprawić błędy w formularzu.', 'error');
      }

      return isValid;
    };

    const nextStep = () => {
      if (validateStep(currentStep.value)) currentStep.value++;
    };

    const prevStep = () => {
      if (currentStep.value > 1) currentStep.value--;
    };

    const { confirm } = useConfirm();

    const handleSubmit = async () => {
      if (!validateStep(3)) {
        return;
      }

      const isConfirmed = await confirm(
        'Dodaj ogłoszenie',
        'Czy na pewno chcesz dodać to ogłoszenie?',
        { confirmText: 'Tak, dodaj', cancelText: 'Nie, wróć' },
      );

      if (!isConfirmed) {
        return;
      }

      loading.value = true;
      try {
        if (isEditMode.value) {
          await jobOfferService.update(offerId, form as JobOffer);
          notification.showMessage('Zaktualizowano ogłoszenie pomyślnie');
        } else {
          const created = await jobOfferService.create(form as JobOffer);

          notification.showMessage('Dodano ogłoszenie pomyślnie');

          await router.push({
            name: 'job-success',
            query: { offerId: created.id, jobTitle: created.jobTitle },
          });
        }
      } catch (error) {
        console.error('Błąd zapisu:', error);
      } finally {
        loading.value = false;
      }
    };

    const instructions = [
      `W tym kroku podaj podstawowe dane o stanowisku i firmie.`,
      `Tutaj uzupełnij szczegóły stanowiska: umowa, wynagrodzenie, opis obowiązków.`,
      `Sprawdź dane i zaakceptuj regulamin przed publikacją.`,
    ];

    const userCoord = ref<{ lat: number; lng: number } | null>(null);

    watch(
      () => form.location,
      async (loc) => {
        if (!loc) {
          userCoord.value = null;
          return;
        }
        userCoord.value = await jobOfferService.geocode(loc);
        if (userCoord.value) {
          form.latitude = userCoord.value.lat;
          form.longitude = userCoord.value.lng;
        } else {
          form.latitude = undefined;
          form.longitude = undefined;
        }
      },
    );

    onMounted(async () => {
      await fetchTemplates();

      if (isEditMode.value) {
        loading.value = true;
        try {
          const data = await jobOfferService.getById(offerId);
          Object.assign(form, data);
        } catch (error) {
          console.error('Błąd podczas pobierania ogłoszenia:', error);
        } finally {
          loading.value = false;
        }
      }
    });

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.position-relative')) {
        showTemplateDropdown.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('click', handleClickOutside);
    });

    return {
      currentStep,
      stepLabels,
      templates,
      selectedTemplate,
      form,
      loading,
      errors,
      instructions,
      pageTitle,
      isEditMode,
      filteredTemplates,
      showTemplateDropdown,
      templateSearchQuery,

      applyTemplate,
      nextStep,
      prevStep,
      handleSubmit,
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

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.step.active {
  font-weight: bold;
  opacity: 1;
  color: #ff5666;
}

.step-number {
  background: #ff5666;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  transition: 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

button.btn-primary {
  background-color: #ff5666;
  border-color: #ff5666;
}

button.btn-primary:hover {
  background-color: #e14b59;
}

.mt-20 {
  margin-top: 20px;
}

.is-invalid,
.is-invalid :deep(input) {
  border-color: #dc3545 !important;
}
.invalid-feedback {
  color: #dc3545;
  font-size: 0.85rem;
}
.text-danger {
  color: #dc3545 !important;
}

.additional-padding :deep(input.form-control) {
  padding-top: 8px;
  padding-bottom: 8px;
}

.form-check-label {
  position: relative;
  padding-left: 2.5rem;
  cursor: pointer;
  user-select: none;
}

.form-check-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.form-check-label::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 50%;
  width: 8px;
  height: 12px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: translateY(-100%) scale(0) rotate(45deg);
  transform-origin: bottom left;
  transition: transform 0.3s ease;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-checkbox:checked + .form-check-label::before {
  background-color: #ff5666;
  border-color: #ff5666;
}

.custom-checkbox:checked + .form-check-label::after {
  transform: translateY(-100%) scale(1) rotate(45deg);
}
</style>
