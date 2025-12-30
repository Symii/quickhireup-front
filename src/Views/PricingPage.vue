<template>
  <div class="pricing-page container py-5">
    <header class="pricing-header text-center mb-5">
      <h1>Wybierz plan dla swojego biznesu</h1>

      <p class="lead">
        Zatrudniaj szybciej i inteligentniej dzięki narzędziom wspieranym przez AI.
      </p>
    </header>

    <div class="row justify-content-center g-4">
      <div class="col-lg-4 col-md-6">
        <div class="pricing-card p-4 h-100 shadow-sm">
          <div class="card-header-custom text-center mb-4">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path :d="mdiLeaf" fill="green" />
            </svg>

            <h3>Free</h3>

            <div class="price">0 PLN<span>/miesiąc</span></div>
          </div>

          <ul class="features-list mb-5">
            <li>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiCheck" fill="green" />
              </svg>

              1 aktywne ogłoszenie
            </li>

            <li>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiCheck" fill="green" />
              </svg>

              Dostęp do podstawowych szablonów
            </li>

            <li>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiCheck" fill="green" />
              </svg>

              Ważność ogłoszenia: 14 dni
            </li>

            <li class="disabled">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiClose" fill="red" />
              </svg>

              Brak generatora opisów AI
            </li>

            <li class="disabled">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiClose" fill="red" />
              </svg>

              Brak promowania ofert
            </li>
          </ul>

          <div class="mt-auto">
            <RouterLink
              to="/company-register"
              class="btn-outline-primary w-100 btn-company-register"
            >
              Stwórz konto
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div class="pricing-card featured p-4 h-100 shadow">
          <div class="badge-featured">Polecane</div>

          <div class="card-header-custom text-center mb-4">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path :d="mdiRocketLaunch" fill="#fc4c4e" />
            </svg>

            <h3>Pro Business</h3>

            <div class="price">199 PLN<span>/miesiąc</span></div>
          </div>

          <ul class="features-list mb-5">
            <li>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiCheck" fill="green" />
              </svg>

              <strong>Nielimitowane</strong> ogłoszenia
            </li>

            <li>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiCheck" fill="green" />
              </svg>

              Pełna biblioteka szablonów
            </li>

            <li>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiCheck" fill="green" />
              </svg>

              Ważność ogłoszenia: 30 dni
            </li>

            <li>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path :d="mdiRobot" fill="#fc4c4e" />
              </svg>

              <strong>Możliwość wygenerowania 100 opisów AI</strong>
            </li>

            <li>
              <i class="fa-solid fa-star text-warning"></i>

              <strong>Promowanie ofert (Top List)</strong>
            </li>
          </ul>

          <div class="mt-auto">
            <button class="btn-generator w-100">Zacznij teraz</button>
          </div>
        </div>
      </div>
    </div>

    <section class="promo-partners mt-5 rounded-4">
      <div class="promo-content">
        <img src="/SI.png" alt="AI Support" />

        <div>
          <h2>Moc AI w Twoich rękach</h2>

          <p class="mb-0">
            Dzięki naszemu algorytmowi wygenerujesz profesjonalne ogłoszenie w 5 sekund. Wystarczy
            podać nazwę stanowiska, a resztę zrobi za Ciebie QuickHireUp Pro.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { mdiCheck, mdiClose, mdiLeaf, mdiRobot, mdiRocketLaunch } from '@mdi/js';
</script>

<style scoped>
.pricing-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 4rem 1rem;
  border-radius: 1.5rem;
  margin-bottom: 4rem;
}

.pricing-card {
  background: white;
  border-radius: 1.2rem;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  border: 1px solid #eee;
}

.pricing-card:hover {
  transform: translateY(-10px);
}

.pricing-card.featured {
  border: 2px solid var(--primary);
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: translateY(-10px) scale(1.05);
}

.badge-featured {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffdd57;
  color: #333;
  padding: 0.4rem 1.2rem;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.pricing-icon {
  font-size: 3rem;
  color: var(--primary);
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
}

.price span {
  font-size: 1rem;
  color: #7e7e7e;
  font-weight: 400;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
}

.features-list li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.features-list li.disabled {
  color: #bbb;
  text-decoration: line-through;
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
}

.btn-outline-primary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 1rem;
  border-radius: 0.8rem;
  font-weight: 600;
  transition:
    background 0.3s,
    color 0.3s;
}

.btn-outline-primary:hover {
  background: var(--primary);
  color: white;
}

.promo-partners {
  background: #f8f9fa;
  padding: 3rem;
}

.promo-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.promo-content img {
  width: 160px;
  height: auto;
  display: block;
  margin: 0 auto;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.btn-company-register {
  display: block;
  text-align: center;
}
</style>
