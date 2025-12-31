<template>
  <div class="container mt-20">
    <header class="settings-header text-center mb-5">
      <h1>Ustawienia konta</h1>

      <p class="lead">Dostosuj swoje powiadomienia, prywatność i bezpieczeństwo konta.</p>
    </header>

    <section class="settings-content row justify-content-center">
      <div class="col-md-4 mb-4">
        <div class="settings-card shadow-sm p-4 text-center">
          <div class="profile-photo-wrapper mb-3">
            <img
              :src="profilePhoto ? `${envApiUrl}${profilePhoto}` : defaultPhoto"
              alt="Zdjęcie profilowe"
              class="profile-photo rounded-circle"
              :class="{ 'pro-border': isPro }"
            />
          </div>

          <h4 class="mb-2">
            {{ userData.firstName }} {{ userData.secondName }}

            <span v-if="isPro" class="badge-pro ms-2" title="Konto Premium">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path :d="mdiRocketLaunch" fill="black" />
              </svg>
              PRO
            </span>
          </h4>

          <p class="text-muted mb-1">Ustawienia konta</p>

          <ul class="list-unstyled mt-3 text-start">
            <li><i class="fa-solid fa-bell me-2"></i>Powiadomienia</li>

            <li><i class="fa-solid fa-user me-2"></i>Prywatność</li>

            <li><i class="fa-solid fa-lightbulb me-2"></i>Bezpieczeństwo</li>
          </ul>

          <template v-if="isLoggedIn && isCompany">
            <div v-if="isPro" class="subscription-status mt-3 p-2 rounded">
              <small class="text-uppercase fw-bold d-block">Status Subskrypcji</small>

              <span class="text-success">
                <i class="fa-solid fa-calendar-check"></i> Aktywna do:
                {{ formatDate(proExpirationDate) }}
              </span>
            </div>

            <div v-else class="subscription-status mt-3 p-2 rounded bg-light">
              <small class="text-uppercase fw-bold d-block">Plan Darmowy</small>

              <RouterLink to="/pricing" class="btn btn-sm btn-outline-primary mt-1">
                Ulepsz do PRO
              </RouterLink>
            </div>
          </template>
        </div>
      </div>

      <div class="col-md-8 mb-4">
        <div class="settings-card shadow-sm p-4 bg-light">
          <h3 :style="{ color: primaryColor }">Edytuj ustawienia</h3>

          <hr />

          <form @submit.prevent="saveSettings" novalidate>
            <div class="mb-4" v-if="isLoggedIn && isCandidate">
              <h5 class="mb-3">Powiadomienia e-mail</h5>

              <div v-if="isCandidate" class="form-check mb-2">
                <input
                  type="checkbox"
                  v-model="settings.notifications.jobAlerts"
                  class="custom-checkbox"
                  id="jobAlerts"
                />

                <label class="form-check-label" for="jobAlerts">
                  Otrzymuj powiadomienia o nowych ofertach pracy
                </label>
              </div>

              <div v-if="isCandidate" class="form-check mb-2">
                <input
                  type="checkbox"
                  v-model="settings.notifications.applicationUpdates"
                  class="custom-checkbox"
                  id="applicationUpdates"
                />

                <label class="form-check-label" for="applicationUpdates">
                  Informuj mnie o zmianach statusu moich aplikacji
                </label>
              </div>
            </div>

            <div class="mb-4" v-if="isLoggedIn && isCompany">
              <h5 class="mb-3">Prywatność</h5>

              <div v-if="isCompany" class="form-check mb-2">
                <input
                  type="checkbox"
                  v-model="settings.privacy.showProfile"
                  class="custom-checkbox"
                  id="showProfile"
                />

                <label class="form-check-label" for="showProfile">
                  Twój profil jest widoczny w wyszukiwarce pracodawców
                </label>
              </div>
            </div>

            <div class="mb-4">
              <h5 class="mb-3">Bezpieczeństwo</h5>

              <div class="mb-3">
                <label class="form-label">Aktualne hasło</label>
                <input
                  type="password"
                  v-model="settings.currentPassword"
                  class="form-control"
                  placeholder="Wprowadź aktualne hasło"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Nowe hasło</label>

                <input
                  type="password"
                  v-model="settings.newPassword"
                  class="form-control"
                  placeholder="Wprowadź nowe hasło"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Potwierdź nowe hasło</label>

                <input
                  type="password"
                  v-model="settings.confirmPassword"
                  class="form-control"
                  placeholder="Powtórz hasło"
                />

                <div v-if="passwordMismatch" class="invalid-feedback d-block">
                  Hasła nie są identyczne.
                </div>
              </div>
            </div>

            <div class="text-end">
              <button
                type="submit"
                class="btn btn-primary"
                :style="{ backgroundColor: primaryColor, borderColor: primaryColor }"
                :disabled="saving"
              >
                {{ saving ? 'Zapisywanie...' : 'Zapisz ustawienia' }}
              </button>
            </div>

            <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
              {{ successMessage }}
            </div>

            <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import accountService from '@/api/services/accountService';
import userService from '@/api/services/usersService';
import { useAuthStore } from '@/api/authentication/authStore';
import { useNotification } from '@/composables/useNotification';
import { mdiRocketLaunch } from '@mdi/js';

const notification = useNotification();

const envApiUrl = import.meta.env.VITE_API_URL;
const defaultPhoto = 'quick-hire-up-logo.png';
const profilePhoto = ref(null as string | null);
const userData = reactive({
  id: '',
  firstName: '',
  secondName: '',
  role: '',
  email: '',
  bio: '',
});

const primaryColor = '#ff5666';

const settings = reactive({
  notifications: {
    jobAlerts: true,
    applicationUpdates: true,
  },
  privacy: {
    showProfile: true,
  },
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isPro = ref(false);
const proExpirationDate = ref('');
const saving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const passwordMismatch = computed(() => {
  return (
    settings.newPassword &&
    settings.confirmPassword &&
    settings.newPassword !== settings.confirmPassword
  );
});

const saveSettings = async () => {
  if (passwordMismatch.value) {
    errorMessage.value = 'Hasła muszą być takie same.';
    return;
  }

  saving.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const updatedSettings = {
      jobAlerts: settings.notifications.jobAlerts,
      applicationUpdates: settings.notifications.applicationUpdates,
      showProfile: settings.privacy.showProfile,
    };

    await accountService.updateSettings(updatedSettings);

    if (auth.user) {
      auth.user.jobAlertsEnabled = updatedSettings.jobAlerts;
      auth.user.applicationUpdatesEnabled = updatedSettings.applicationUpdates;
      auth.user.showProfile = updatedSettings.showProfile;
    }

    if (settings.newPassword && settings.currentPassword) {
      await userService.changePassword(
        settings.currentPassword,
        settings.newPassword,
        settings.confirmPassword,
      );
    }

    successMessage.value = 'Ustawienia zapisane pomyślnie!';
    notification.showMessage('Ustawienia zostały zaktualizowane.', 'success');
  } catch {
    errorMessage.value = 'Wystąpił błąd zapisu ustawień.';
    notification.showMessage('Błąd połączenia z serwerem', 'error');
  } finally {
    saving.value = false;
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
const auth = useAuthStore();

const currentUser = computed(() => auth.user);
const isLoggedIn = computed(() => auth.user != null);
const isCandidate = computed(() => accountService.isCandidate());
const isCompany = computed(() => accountService.isCompany());

onMounted(async () => {
  if (!currentUser.value) {
    return;
  }

  Object.assign(userData, currentUser.value);

  settings.notifications.jobAlerts = currentUser.value.jobAlertsEnabled;
  settings.notifications.applicationUpdates = currentUser.value.applicationUpdatesEnabled;

  settings.privacy.showProfile = currentUser.value.showProfile;

  isPro.value = currentUser.value?.isPro ?? false;
  proExpirationDate.value = currentUser.value?.proExpirationDate ?? '';

  profilePhoto.value = currentUser.value.photoUrl ?? null;
});
</script>

<style scoped>
.settings-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 3rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.settings-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.settings-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.settings-icon-wrapper {
  display: inline-block;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 86, 102, 0.1);
  margin: 0 auto;
}

.form-label {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
}

input.form-control {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus {
  border-color: #ff5666;
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.3);
}

.invalid-feedback {
  color: #dc3545;
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

button.btn-primary:disabled {
  background-color: #ffb3b8;
  border-color: #ffb3b8;
  cursor: not-allowed;
}

.mt-20 {
  margin-top: 20px;
}

.profile-photo-wrapper {
  position: relative;
  display: inline-block;
}

.profile-photo {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border: 4px solid var(--primary);
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
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

.custom-checkbox:checked + .form-check-label::before {
  background-color: #ff5666;
  border-color: #ff5666;
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

.custom-checkbox:checked + .form-check-label::after {
  transform: translateY(-100%) scale(1) rotate(45deg);
}

.profile-photo.pro-border {
  border: 4px solid #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

.badge-pro {
  background: linear-gradient(45deg, #ffd700, #ffae00);
  color: #000;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subscription-status {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  font-size: 0.85rem;
}

.subscription-status i {
  margin-right: 5px;
}

.btn-outline-primary {
  color: #ff5666;
  border-color: #ff5666;
}
.btn-outline-primary:hover {
  background-color: #ff5666;
  color: white !important;
}
</style>
