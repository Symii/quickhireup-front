<template>
  <div class="payment-error-page container">
    <div class="row justify-content-center w-100 m-0">
      <div class="col-lg-6 col-md-8">
        <div class="status-card p-5 shadow-sm text-center">
          <div class="icon-wrapper mb-4">
            <svg viewBox="0 0 24 24" width="80" height="80">
              <circle cx="12" cy="12" r="11" fill="#fff5f5" />
              <path :d="mdiAlertCircle" fill="#ff5252" transform="scale(0.6) translate(8, 8)" />
            </svg>
          </div>

          <h1 class="mb-3">Coś poszło nie tak...</h1>

          <p class="lead mb-5 text-muted">
            Przepraszamy, ale nie mogliśmy przetworzyć Twojej płatności za plan
            <strong>Pro Business</strong>. Twoje środki nie zostały pobrane.
          </p>

          <div class="info-box p-4 rounded-4 mb-5">
            <div class="d-flex align-items-center justify-content-center gap-3 mb-2">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiCreditCardOff" fill="#6c757d" />
              </svg>
              <span class="fw-bold text-danger">Błąd autoryzacji</span>
            </div>

            <p class="small text-secondary mb-0">
              Upewnij się, że masz wystarczające środki na koncie lub spróbuj użyć innej metody
              płatności.
            </p>
          </div>

          <div class="d-grid gap-3">
            <button @click="retryPayment" class="btn-retry text-decoration-none border-0">
              Spróbuj ponownie
            </button>

            <RouterLink to="/" class="btn-outline-secondary text-decoration-none">
              Wróć do strony głównej
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { mdiAlertCircle, mdiCreditCardOff } from '@mdi/js';

const retryPayment = () => {
  router.push('/pricing');
};
</script>

<style scoped>
.payment-error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-card {
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #fee2e2;
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
  background: #fffafa;
  border: 1px dashed #feb2b2;
}

.btn-retry {
  background: #ff5252;
  color: white;
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 600;
  transition: opacity 0.3s;
  cursor: pointer;
  display: inline-block;
}

.btn-retry:hover {
  opacity: 0.9;
  background: #ff3838;
}

.btn-outline-secondary {
  background: transparent;
  color: #6c757d;
  border: 2px solid #dee2e6;
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-outline-secondary:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

h1 {
  color: #d32f2f;
  font-weight: 700;
}

.lead {
  font-size: 1.1rem;
}
</style>
