<template>
  <div class="container mt-20">
    <header class="form-header text-center mb-5">
      <h1>Aplikacja na stanowisko</h1>

      <p class="lead">Wypełnij formularz krok po kroku, aby wysłać swoją aplikację.</p>
    </header>

    <section class="row justify-content-center">
      <div class="col-md-6 mb-4">
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

              <div class="form-check mt-3">
                <input
                  type="checkbox"
                  v-model="form.agreePrivacy"
                  class="form-check-input"
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

      <div class="col-md-4">
        <div class="form-card shadow-sm p-4 bg-light">
          <h4>Instrukcja – {{ stepLabels[currentStep - 1] }}</h4>

          <p>{{ instructions[currentStep - 1] }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

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

  if (step === 3 && !form.agreePrivacy)
    errors.agreePrivacy = 'Błąd: Musisz zaakceptować politykę prywatności';

  return Object.values(errors).every((v) => !v);
};

const nextStep = () => {
  if (validateStep(currentStep.value)) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const handleSubmit = async () => {
  if (!validateStep(3)) return;

  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 1200));
    alert('✅ Twoja aplikacja została wysłana!');
  } finally {
    loading.value = false;
  }
};

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  form.cv = file;
  form.cvName = file?.name || '';
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
</style>
