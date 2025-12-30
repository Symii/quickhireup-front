<template>
  <div class="payment-status-page container">
    <div class="row justify-content-center w-100 m-0">
      <div class="col-lg-6 col-md-8">
        <div class="status-card p-5 shadow-sm text-center">
          <div class="icon-wrapper mb-4">
            <svg viewBox="0 0 24 24" width="80" height="80">
              <circle cx="12" cy="12" r="11" fill="#e8f5e9" />
              <path :d="mdiCheck" fill="#4caf50" transform="scale(0.6) translate(8, 8)" />
            </svg>
          </div>

          <h1 class="mb-3">Płatność zakończona!</h1>

          <p class="lead mb-5 text-muted">
            Twoje konto zostało pomyślnie zaktualizowane do planu <strong>Pro Business</strong>. Moc
            AI jest już dostępna w Twoim panelu.
          </p>

          <div class="info-box p-4 rounded-4 mb-5">
            <div class="d-flex align-items-center justify-content-center gap-3 mb-2">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiRocketLaunch" fill="#fc4c4e" />
              </svg>
              <span class="fw-bold">Aktywne: QuickHireUp Pro</span>
            </div>

            <p class="small text-secondary mb-0">
              Twoje ogłoszenia są teraz promowane, a limit opisów AI został odnowiony.
            </p>
          </div>

          <div class="d-grid gap-3">
            <RouterLink to="/generator" class="btn-generator text-decoration-none">
              Przejdź do generowania
            </RouterLink>

            <RouterLink to="/" class="btn-outline-primary text-decoration-none">
              Wróć do strony głównej
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiCheck, mdiRocketLaunch } from '@mdi/js';
</script>

<style scoped>
.payment-status-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-card {
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #eee;
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  display: flex;
  justify-content: center;
}

.info-box {
  background: #f8f9fa;
  border: 1px dashed #dee2e6;
}

.btn-generator {
  background: var(--primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 600;
  transition: opacity 0.3s;
  cursor: pointer;
  display: inline-block;
}

.btn-generator:hover {
  opacity: 0.9;
  color: white;
}

.btn-outline-primary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-outline-primary:hover {
  background: var(--primary);
  color: white;
}

h1 {
  color: #333;
  font-weight: 700;
}

.lead {
  font-size: 1.1rem;
}
</style>
