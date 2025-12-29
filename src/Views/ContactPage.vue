<template>
  <section class="map-section mb-5">
    <div class="map-container">
      <div id="map" style="height: 300px; width: 100%"></div>
    </div>
  </section>

  <div class="contact-page container py-5">
    <section class="contact-form-section mb-5 row justify-content-center">
      <div class="col-md-6 mb-4">
        <div class="form-card shadow-sm p-4">
          <h2>Skontaktuj się z <strong>nami</strong></h2>

          <p class="contact-lead">
            Masz pytania lub potrzebujesz wsparcia? Skontaktuj się z nami, odpowiemy najszybciej jak
            to możliwe.
          </p>

          <form @submit.prevent="submitForm" novalidate>
            <div class="mb-3">
              <label class="form-label">Imię i nazwisko</label>

              <input
                type="text"
                v-model="form.name"
                placeholder="Twoje imię i nazwisko"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />

              <div v-if="errors.name" class="invalid-feedback">Proszę podać imię i nazwisko.</div>
            </div>

            <div class="mb-3">
              <label class="form-label">E-mail</label>

              <input
                type="email"
                v-model="form.email"
                placeholder="Twój e-mail"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
              />

              <div v-if="errors.email" class="invalid-feedback">Proszę podać poprawny e-mail.</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Temat</label>

              <input
                type="text"
                v-model="form.subject"
                placeholder="Temat wiadomości"
                class="form-control"
                :class="{ 'is-invalid': errors.subject }"
              />

              <div v-if="errors.subject" class="invalid-feedback">Proszę podać temat.</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Wiadomość</label>

              <textarea
                v-model="form.message"
                placeholder="Treść wiadomości"
                class="form-control"
                rows="5"
                :class="{ 'is-invalid': errors.message }"
              ></textarea>

              <div v-if="errors.message" class="invalid-feedback">Proszę wpisać wiadomość.</div>
            </div>

            <div class="text-end">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Wysyłanie...' : 'Wyślij wiadomość' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-md-4">
        <div class="info-cards d-flex flex-column gap-3">
          <div class="info-card text-center">
            <i class="fa-solid fa-paper-plane fa-2x mb-3 text-primary"></i>

            <h4>Adres</h4>

            <p>ul. Krzysztofa Arciszewskiego 22A, 76-200 Słupsk</p>
          </div>

          <div class="info-card text-center">
            <i class="fa-solid fa-envelope fa-2x mb-3 text-primary"></i>

            <h4>Email</h4>

            <p>bok@quickhireup.com</p>
          </div>

          <div class="info-card text-center">
            <i class="fa-solid fa-comment fa-2x mb-3 text-primary"></i>

            <h4>Telefon</h4>

            <p>+48 123 456 789</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNotification } from '@/composables/useNotification';
import api from '@/api/services/api';

const notification = useNotification();

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const errors = reactive({
  name: false,
  email: false,
  subject: false,
  message: false,
});

const loading = ref(false);

const validateForm = () => {
  errors.name = !form.name;
  errors.email = !form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  errors.subject = !form.subject;
  errors.message = !form.message;
  return !Object.values(errors).some(Boolean);
};

async function submitForm() {
  if (!validateForm()) {
    notification.showMessage('Proszę poprawić błędy w formularzu.', 'error');
    return;
  }

  loading.value = true;

  try {
    const response = await api.post('http://localhost:5000/api/contact', form);

    if (!response.data) {
      notification.showMessage('Wystąpił błąd podczas wysyłania wiadomości.', 'error');
      throw new Error('Wystąpił błąd podczas wysyłania wiadomości.');
    }

    notification.showMessage('Wiadomość została wysłana pomyślnie.', 'success');

    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
  } catch {
    notification.showMessage('Wystąpił błąd podczas wysyłania wiadomości.', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const longitude = 17.0424463;
  const latitude = 54.452509;
  const map = L.map('map').setView([latitude, longitude], 16);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map);
});
</script>

<style scoped>
.form-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  padding: 2rem;
}

.form-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

input.form-control,
textarea.form-control {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input.form-control:focus,
textarea.form-control:focus {
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

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

.contact-lead {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  width: 100%;
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--card);
  box-shadow: var(--shadow);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.info-card i {
  margin-bottom: 1rem;
  font-size: 2rem;
  color: var(--primary);
}

.info-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.info-card p {
  margin: 0;
  font-size: 1rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .contact-form-section {
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
  }
}
</style>
