<template>
  <div class="container mt-20">
    <header class="profile-header text-center mb-5">
      <h1>Profil użytkownika</h1>

      <p class="lead">
        Zarządzaj swoim profilem, aktualizuj dane i utrzymuj swój wizerunek zawodowy na bieżąco.
      </p>
    </header>

    <section class="profile-content row justify-content-center">
      <div class="col-md-4 mb-4 text-center">
        <div class="profile-card shadow-sm p-4">
          <div class="profile-photo-wrapper position-relative mb-3">
            <img
              :src="previewPhoto || profilePhoto || defaultPhoto"
              alt="Zdjęcie profilowe"
              class="profile-photo rounded-circle"
            />

            <label class="upload-btn">
              <i class="fa-solid fa-image"></i>

              <input type="file" accept="image/*" @change="onFileChange" hidden />
            </label>
          </div>

          <h4 class="mb-1">{{ userData.firstName }} {{ userData.secondName }}</h4>

          <p class="text-muted mb-1">{{ userData.role }}</p>

          <p class="text-muted small">{{ userData.email }}</p>

          <div class="decor-line"></div>

          <p class="text-muted small">{{ userData.bio }}</p>
        </div>
      </div>

      <div class="col-md-8">
        <div class="profile-card shadow-sm p-4 bg-light">
          <h3 class="mb-4" :style="{ color: primaryColor }">Edytuj dane profilu</h3>

          <form @submit.prevent="saveProfile" novalidate>
            <div class="mb-3">
              <label class="form-label">Imię</label>

              <input
                type="text"
                v-model="userData.firstName"
                class="form-control"
                required
                :class="{ 'is-invalid': errors.firstName }"
                @input="markUnsaved"
              />

              <div class="invalid-feedback">To pole jest wymagane.</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Nazwisko</label>

              <input
                type="text"
                v-model="userData.secondName"
                class="form-control"
                required
                :class="{ 'is-invalid': errors.secondName }"
                @input="markUnsaved"
              />

              <div class="invalid-feedback">To pole jest wymagane.</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Adres e-mail</label>

              <input
                type="email"
                v-model="userData.email"
                class="form-control"
                required
                :class="{ 'is-invalid': errors.email }"
                @input="markUnsaved"
              />

              <div class="invalid-feedback">Podaj poprawny adres e-mail.</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Opis / Bio</label>

              <textarea
                v-model="userData.bio"
                class="form-control"
                rows="4"
                placeholder="Opowiedz krótko o sobie, swoich umiejętnościach i doświadczeniu..."
                @input="markUnsaved"
              ></textarea>
            </div>

            <div class="text-end mb-3">
              <span v-if="unsavedChanges" class="text-danger ms-2 unsaved-changes">
                Masz niezapisane zmiany!
              </span>

              <button
                type="submit"
                class="btn btn-primary"
                :style="{ backgroundColor: primaryColor, borderColor: primaryColor }"
                :disabled="saving"
              >
                {{ saving ? 'Zapisywanie...' : 'Zapisz' }}
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
import { useAuthStore } from '@/api/authentication/authStore';
import userService from '@/api/services/usersService';
import type { UpdateUserDto } from '@/api/types/updateUserDto';
import { ref, reactive, onMounted, computed } from 'vue';

const primaryColor = '#ff5666';
const defaultPhoto = 'quick-hire-up-logo.png';
const profilePhoto = ref('');
const previewPhoto = ref<string | null>(null);

const userData = reactive({
  id: '',
  firstName: '',
  secondName: '',
  role: '',
  email: '',
  bio: '',
});

const errors = reactive({
  firstName: false,
  secondName: false,
  email: false,
});

const saving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const unsavedChanges = ref(false);

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateForm = () => {
  errors.firstName = !userData.firstName.trim();
  errors.secondName = !userData.secondName.trim();
  errors.email = !validateEmail(userData.email);
  return !errors.firstName && !errors.secondName && !errors.email;
};

const markUnsaved = () => {
  unsavedChanges.value = true;
};

const selectedFile = ref<File | null>(null);

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  selectedFile.value = file;
  previewPhoto.value = URL.createObjectURL(file);
  markUnsaved();
};

async function saveProfile() {
  if (!validateForm()) return;

  saving.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    if (selectedFile.value) {
      const formData = new FormData();
      formData.append('file', selectedFile.value);
      const response = await userService.uploadProfilePhoto(userData.id, formData);
      profilePhoto.value = `http://localhost:5000${response.photoUrl}`;
      previewPhoto.value = null;
      selectedFile.value = null;
    }

    const dto: UpdateUserDto = {
      firstName: userData.firstName,
      secondName: userData.secondName,
      email: userData.email,
      bio: userData.bio,
    };

    await userService.update(userData.id, dto);
    successMessage.value = '✅ Zmiany zostały zapisane pomyślnie!';
    unsavedChanges.value = false;
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Wystąpił błąd podczas zapisywania zmian.';
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    const auth = useAuthStore();

    const currentUser = computed(() => auth.user);
    Object.assign(userData, currentUser.value);

    if (currentUser.value?.photoUrl) {
      profilePhoto.value = `http://localhost:5000${currentUser.value.photoUrl}`;
    }
  } catch (error) {
    console.error('Błąd podczas ładowania danych użytkownika:', error);
  }
});
</script>

<style scoped>
.profile-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 3rem 1rem;
  border-radius: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.profile-card {
  background: #fff;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
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

.upload-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-btn:hover {
  background: var(--primary-dark);
}

.form-label {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
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

input.is-invalid,
textarea.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.3);
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
  box-shadow: none;
}

.mt-20 {
  margin-top: 20px;
}

.decor-line {
  width: 30%;
  height: 4px;
  background: linear-gradient(to right, var(--primary), var(--primary-dark));
  margin: 12px auto;
  border-radius: 2px;
}

.unsaved-changes {
  margin-right: 10px;
  color: red;
  font-weight: bold;
}
</style>
