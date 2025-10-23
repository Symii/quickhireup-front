<template>
  <div class="user-form-card shadow-sm p-4 mt-4">
    <h3 class="mb-3" :style="{ color: primaryColor }">
      {{ form.id ? 'Edytuj użytkownika' : 'Dodaj nowego użytkownika' }}
    </h3>

    <form @submit.prevent="save" novalidate>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Email</label>

          <input
            v-model="form.email"
            type="email"
            class="form-control"
            placeholder="Adres e-mail"
            required
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">Rola</label>

          <input
            v-model="form.role"
            disabled
            type="text"
            class="form-control"
            placeholder="Np. Administrator, HR..."
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">Imię</label>

          <input v-model="form.firstName" type="text" class="form-control" placeholder="Imię" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Nazwisko</label>

          <input
            v-model="form.secondName"
            type="text"
            class="form-control"
            placeholder="Nazwisko"
          />
        </div>
      </div>

      <div class="text-end mt-4">
        <button
          type="submit"
          class="btn btn-primary"
          :style="{ backgroundColor: primaryColor, borderColor: primaryColor }"
        >
          Zapisz
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import userService from '@/api/services/usersService';
import type { User } from '@/api/types/user';
import type { UpdateUserDto } from '@/api/types/updateUserDto';

const props = defineProps<{ user: User }>();
const form = ref<User>({ ...props.user });
const primaryColor = '#ff5666';
const emit = defineEmits(['saved']);

watch(
  () => props.user,
  (val) => {
    form.value = { ...val };
  },
);

async function save() {
  const dto: UpdateUserDto = {
    firstName: form.value.firstName,
    secondName: form.value.secondName,
    email: form.value.email,
    bio: props.user.bio,
  };

  if (form.value.id) {
    await userService.update(form.value.id, dto);
  } else {
    await userService.create(dto);
  }

  emit('saved');
}
</script>

<style scoped>
.user-form-card {
  background: #fff;
  border-radius: 12px;
}

.form-label {
  font-weight: 600;
  color: #444;
}

input.form-control {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 10px 14px;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input.form-control:focus {
  border-color: #ff5666;
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.3);
}

button.btn-primary {
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

button.btn-primary:hover {
  background-color: #e14b59;
  box-shadow: 0 6px 20px rgba(225, 75, 89, 0.5);
}
</style>
