<template>
  <section class="map-section mb-5">
    <div class="map-container">
      <div id="map" style="height: 300px; width: 100%"></div>
    </div>
  </section>

  <div class="contact-page container py-5">
    <section class="contact-form-section mb-5">
      <div>
        <h2>Skontaktuj się z <strong>nami</strong></h2>

        <p class="contact-lead">
          Masz pytania lub potrzebujesz wsparcia? Skontaktuj się z nami, odpowiemy najszybciej jak
          to możliwe.
        </p>

        <form class="contact-form" @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="input-group">
              <label for="name">Imię i nazwisko</label>

              <input id="name" type="text" v-model="form.name" required />
            </div>

            <div class="input-group">
              <label for="email">E-mail</label>

              <input id="email" type="email" v-model="form.email" required />
            </div>

            <div class="input-group">
              <label for="subject">Temat</label>

              <input id="subject" type="text" v-model="form.subject" required />
            </div>

            <div class="input-group">
              <label for="message">Wiadomość</label>

              <textarea
                id="message"
                v-model="form.message"
                class="form-control"
                rows="5"
                required
              ></textarea>
            </div>
          </div>

          <div class="mt-4 text-end">
            <button type="submit" class="btn btn-gradient btn-lg">Wyślij wiadomość</button>
          </div>
        </form>
      </div>

      <div class="info-cards">
        <div class="info-card">
          <i class="fa-solid fa-paper-plane fa-2x mb-3 text-primary"></i>

          <h4>Adres</h4>

          <p>ul. Krzysztofa Arciszewskiego 22A, 76-200 Słupsk</p>
        </div>

        <div class="info-card">
          <i class="fa-solid fa-envelope fa-2x mb-3 text-primary"></i>

          <h4>Email</h4>

          <p>bok@quickhireup.com</p>
        </div>

        <div class="info-card">
          <i class="fa-solid fa-comment fa-2x mb-3 text-primary"></i>

          <h4>Telefon</h4>

          <p>+48 123 456 789</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

onMounted(() => {
  const longitude = 17.0424463;
  const latitude = 54.452509;
  const map = L.map('map').setView([latitude, longitude], 16);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map).openPopup();
});

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

function submitForm() {
  alert('Wiadomość została wysłana');

  form.name = '';
  form.email = '';
  form.subject = '';
  form.message = '';
}
</script>

<style scoped>
.contact-header h1 {
  font-size: 2.25rem;
}

.contact-lead {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.row.text-center.g-4 {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-end;
  max-width: 300px;
}

.info-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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

.contact-form-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.map-container {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.input-group label {
  font-weight: 500;
  color: #4a4a4a;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #d3d3d3;
  border-radius: 0.6rem;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  outline: none;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: rgb(255, 86, 102);
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.5);
}

@media (max-width: 768px) {
  .contact-form-section {
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
  }

  .info-cards {
    align-items: center;
    max-width: 100%;
  }
}
</style>
