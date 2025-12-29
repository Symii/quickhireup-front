<template>
  <div class="container mt-20">
    <header class="form-header text-center mb-5">
      <h1>Aplikacja na stanowisko</h1>

      <p class="lead">Wypełnij formularz krok po kroku, aby wysłać swoją aplikację.</p>
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
              <h4 class="mb-3">Dane osobowe</h4>

              <div class="mb-3">
                <label class="form-label">Imię i nazwisko</label>

                <input
                  type="text"
                  v-model="form.name"
                  :class="['form-control', { 'is-invalid': errors.name }]"
                />

                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Adres e-mail</label>

                <input
                  type="email"
                  v-model="form.email"
                  :class="['form-control', { 'is-invalid': errors.email }]"
                />

                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Numer telefonu</label>

                <input
                  type="text"
                  v-model="form.phone"
                  :class="['form-control', { 'is-invalid': errors.phone }]"
                />

                <div class="invalid-feedback">{{ errors.phone }}</div>
              </div>

              <div class="text-end">
                <button class="btn btn-primary" type="button" @click="nextStep">Dalej →</button>
              </div>
            </div>

            <div v-if="currentStep === 2">
              <h4 class="mb-3">Doświadczenie i wykształcenie</h4>

              <div class="mb-3">
                <label class="form-label">Doświadczenie zawodowe</label>

                <textarea
                  v-model="form.experience"
                  rows="3"
                  :class="['form-control', { 'is-invalid': errors.experience }]"
                ></textarea>

                <div class="invalid-feedback">{{ errors.experience }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Wykształcenie</label>

                <input
                  type="text"
                  v-model="form.education"
                  :class="['form-control', { 'is-invalid': errors.education }]"
                />

                <div class="invalid-feedback">{{ errors.education }}</div>
              </div>

              <div class="text-end">
                <button class="btn btn-outline-secondary me-2" type="button" @click="prevStep">
                  ← Wstecz
                </button>

                <button class="btn btn-primary" type="button" @click="nextStep">Dalej →</button>
              </div>
            </div>

            <div v-if="currentStep === 3">
              <h4 class="mb-3">Załącz CV i wyślij aplikację</h4>

              <div class="mb-3">
                <label class="form-label">CV / Resume (PDF)</label>

                <input type="file" accept=".pdf" @change="onFileChange" class="form-control" />

                <small v-if="form.cvName" class="text-muted">Wybrany plik: {{ form.cvName }}</small>
              </div>

              <div class="mb-3">
                <label class="form-label">List motywacyjny (opcjonalnie)</label>

                <textarea v-model="form.coverLetter" rows="4" class="form-control"></textarea>
              </div>

              <div class="form-check mb-2">
                <input
                  type="checkbox"
                  v-model="form.agreePrivacy"
                  class="custom-checkbox"
                  id="agreePrivacy"
                />

                <label for="agreePrivacy" class="form-check-label">
                  Akceptuję politykę prywatności
                </label>

                <div v-if="errors.agreePrivacy" class="text-danger small mt-1">
                  {{ errors.agreePrivacy }}
                </div>
              </div>

              <div class="text-end mt-3">
                <button class="btn btn-outline-secondary me-2" type="button" @click="prevStep">
                  ← Wstecz
                </button>

                <button class="btn btn-primary" type="submit" :disabled="loading">
                  {{ loading ? 'Wysyłanie...' : 'Wyślij aplikację' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="col-lg-4 mb-4">
        <div class="form-card shadow-sm p-4 bg-light">
          <h4>Instrukcja – {{ stepLabels[currentStep - 1] }}</h4>

          <p>{{ instructions[currentStep - 1] }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/api/authentication/authStore';
import api from '@/api/services/api';
import { useConfirm } from '@/composables/useConfirm';
import { useNotification } from '@/composables/useNotification';
import router from '@/router';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const notification = useNotification();
const route = useRoute();

const jobIdFromUrl = route.params.id as string;

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  cv: File | null;
  cvName: string;
  coverLetter: string;
  agreePrivacy: boolean;
}

const currentStep = ref(1);
const stepLabels = ['Dane osobowe', 'Doświadczenie', 'CV & Podsumowanie'];
const loading = ref(false);

const form = reactive<ApplicationForm>({
  name: '',
  email: '',
  phone: '',
  experience: '',
  education: '',
  cv: null,
  cvName: '',
  coverLetter: '',
  agreePrivacy: false,
});

const errors = reactive<Record<string, string>>({});

const instructions = [
  'Podaj swoje dane kontaktowe, aby pracodawca mógł się z Tobą skontaktować.',
  'Opisz swoje doświadczenie zawodowe i wykształcenie.',
  'Załącz CV i zaakceptuj politykę prywatności przed wysłaniem aplikacji.',
];

const validateStep = (step: number) => {
  Object.keys(errors).forEach((k) => (errors[k] = ''));

  if (step === 1) {
    if (!form.name) errors.name = 'Błąd: Proszę podać imię i nazwisko';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Błąd: Proszę podać poprawny e-mail';
    if (!form.phone) errors.phone = 'Błąd: Proszę podać numer telefonu';
  }

  if (step === 2) {
    if (!form.experience) errors.experience = 'Proszę opisać doświadczenie';
    if (!form.education) errors.education = 'Proszę podać wykształcenie';
  }

  if (step === 3) {
    if (!form.cv) errors.agreePrivacy = 'Błąd: Musisz załączyć plik CV';
    if (!form.agreePrivacy) errors.agreePrivacy = 'Błąd: Musisz zaakceptować politykę prywatności';
  }

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

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  form.cv = file;
  form.cvName = file?.name || '';
};

const { confirm } = useConfirm();

const handleSubmit = async () => {
  if (!validateStep(3)) {
    return;
  }

  const isConfirmed = await confirm(
    'Wyślij aplikację',
    'Czy na pewno chcesz wysłać swoją aplikację na to stanowisko?',
    { confirmText: 'Tak, wyślij', cancelText: 'Nie, wróć' },
  );

  if (!isConfirmed) {
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append('JobAdvertisementId', jobIdFromUrl);
  formData.append('Name', form.name);
  formData.append('Email', form.email);
  formData.append('Phone', form.phone);
  formData.append('Experience', form.experience);
  formData.append('Education', form.education);
  formData.append('CoverLetter', form.coverLetter);
  formData.append('AgreePrivacy', form.agreePrivacy.toString());

  if (form.cv) {
    formData.append('CvFile', form.cv);
  }

  try {
    const response = await api.post('http://localhost:5000/api/applications', formData);

    if (!response.data) {
      notification.showMessage('Wystąpił błąd podczas wysyłania.', 'error');
      throw new Error('Wystąpił błąd podczas wysyłania.');
    }

    notification.showMessage('Twoja aplikacja została wysłana pomyślnie!', 'success');
    await router.push({
      name: 'application-success',
    });
  } catch {
    notification.showMessage('Błąd połączenia z serwerem', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const auth = useAuthStore();
  const isLoggedIn = computed(() => auth.user != null);

  if (isLoggedIn.value) {
    form.name = `${auth.user?.firstName} ${auth.user?.secondName}`;
    form.email = auth.user?.email || '';
  }
});
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

.is-invalid {
  border-color: #dc3545 !important;
}
.invalid-feedback {
  color: #dc3545;
  font-size: 0.85rem;
}
.text-danger {
  color: #dc3545 !important;
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
