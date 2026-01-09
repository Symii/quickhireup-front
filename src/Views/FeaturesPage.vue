<template>
  <div class="ai-page container py-5">
    <header class="ai-header text-center mb-5">
      <div class="icon-wrapper mb-3">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path :d="mdiRobot" fill="white" />
        </svg>
      </div>

      <h1>Generator opisów AI</h1>

      <p class="lead">
        Zapomnij o czasochłonnym tworzeniu treści ogłoszenia o pracę. Stwórz opis stanowiska w kilka
        sekund dzięki generatorowi AI.
      </p>
    </header>

    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="feature-card p-4 h-100">
          <div class="icon-box mb-3">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path :d="mdiFlash" fill="#ffdd57" />
            </svg>
          </div>

          <h3>Błyskawiczne działanie</h3>

          <p class="text-muted">
            Wpisujesz tylko nazwę stanowiska i kluczowe wymagania. Nasz algorytm zajmuje się resztą
            w zaledwie kilka sekund.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="feature-card p-4 h-100 featured-border">
          <div class="icon-box mb-3">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path :d="mdiAutoFix" fill="var(--primary)" />
            </svg>
          </div>

          <h3>Czysty język</h3>

          <p class="text-muted">
            AI generuje treści zoptymalizowane pod kątem czytelności i profesjonalizmu, unikając
            błędów i powtórzeń.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="feature-card p-4 h-100">
          <div class="icon-box mb-3">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path :d="mdiTarget" fill="#fc4c4e" />
            </svg>
          </div>

          <h3>Trafność</h3>

          <p class="text-muted">
            Nasz algorytm dobiera styl komunikacji do Twojej branży. Inaczej napiszemy ofertę dla
            programisty, a inaczej dla managera sprzedaży.
          </p>
        </div>
      </div>
    </div>

    <section class="demo-section rounded-4 p-5 mb-5">
      <div class="row align-items-center">
        <div class="col-lg-5 mb-4 mb-lg-0">
          <h2 class="mb-4">Jak to działa?</h2>
          <ul class="steps-list">
            <li>
              <div class="step-number">1</div>
              <div>
                <strong>Podaj stanowisko</strong>

                <p class="small text-muted mb-0">Np. "Junior .NET Developer"</p>
              </div>
            </li>

            <li>
              <div class="step-number">2</div>
              <div>
                <strong>Uzupełnij resztę pól</strong>

                <p class="small text-muted mb-0">
                  Lokalizacja, doświadczenie, rodzaj umowy i zatrudnienia.
                </p>
              </div>
            </li>

            <li>
              <div class="step-number">3</div>
              <div>
                <strong>Kliknij "Wygeneruj"</strong>

                <p class="small text-muted mb-0">Otrzymasz gotowy opis w kilka sekund.</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="col-lg-7">
          <div class="mockup-window shadow-lg">
            <div class="mockup-header">
              <span class="dot red"></span>

              <span class="dot yellow"></span>

              <span class="dot green"></span>
            </div>

            <div class="mockup-content p-4">
              <div class="skeleton-input mb-3"></div>

              <div class="ai-typing-effect">
                <span class="text-primary fw-bold">AI:</span> Poszukujemy początkującego programisty
                .NET do zespołu IT na uczelni, który będzie odpowiedzialny za wsparcie i rozwój
                aplikacji edukacyjnych oraz administracyjnych w środowisku .NET...

                <span class="cursor">|</span>
              </div>

              <div class="skeleton-btn mt-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="cta-footer text-center mt-5">
      <h2 class="mb-3">Gotowy, by przyspieszyć rekrutację?</h2>

      <p class="mb-4 text-muted">Dostępne w planie Pro Business już od 199 PLN.</p>

      <div class="d-flex justify-content-center gap-3">
        <RouterLink :to="generatorLink" class="btn-cta-primary">
          {{ generatorText }}

          <svg viewBox="0 0 24 24" width="20" height="20" class="ms-2">
            <path :d="mdiArrowRight" fill="currentColor" />
          </svg>
        </RouterLink>

        <RouterLink to="/pricing" class="btn-cta-outline"> Zobacz cennik </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/api/authentication/authStore';
import accountService from '@/api/services/accountService';
import { mdiArrowRight, mdiAutoFix, mdiFlash, mdiRobot, mdiTarget } from '@mdi/js';
import { computed } from 'vue';

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.user != null);
const isCompany = computed(() => accountService.isCompany());

const generatorLink = computed(() =>
  isLoggedIn.value && isCompany.value ? '/generator' : '/company-registe',
);

const generatorText = computed(() =>
  isLoggedIn.value && isCompany.value ? 'Wypróbuj teraz' : 'Zarejestruj się',
);
</script>

<style scoped>
.ai-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 4rem 2rem;
  border-radius: 1.5rem;
  position: relative;
  overflow: hidden;
}

.ai-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle at 20% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 25%
  );
  pointer-events: none;
}

.feature-card {
  background: white;
  border-radius: 1.2rem;
  border: 1px solid #eee;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.feature-card.featured-border {
  border-bottom: 4px solid var(--primary);
}

.icon-box {
  background: #f8f9fa;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.demo-section {
  background: #fdfdfd;
  border: 1px solid #eee;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.steps-list li {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.step-number {
  background: var(--primary);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.mockup-window {
  background: white;
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.mockup-header {
  background: #f1f3f5;
  padding: 0.8rem 1rem;
  display: flex;
  gap: 6px;
  border-bottom: 1px solid #e0e0e0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red {
  background: #ff5f56;
}
.dot.yellow {
  background: #ffbd2e;
}
.dot.green {
  background: #27c93f;
}

.skeleton-input {
  height: 40px;
  background: #f0f0f0;
  border-radius: 6px;
  width: 60%;
}

.skeleton-btn {
  height: 36px;
  background: var(--primary);
  opacity: 0.2;
  border-radius: 6px;
  width: 30%;
}

.ai-typing-effect {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.btn-cta-primary {
  background: var(--primary);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 0.8rem;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.3s;
}

.btn-cta-primary:hover {
  opacity: 0.9;
  color: white;
}

.btn-cta-outline {
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
  padding: 0.8rem 2rem;
  border-radius: 0.8rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cta-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 768px) {
  .ai-header {
    padding: 3rem 1rem;
  }

  .steps-list li {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    align-items: center;
  }

  .cta-footer .d-flex {
    flex-direction: column;
  }

  .btn-cta-primary,
  .btn-cta-outline {
    width: 100%;
    justify-content: center;
  }
}
</style>
