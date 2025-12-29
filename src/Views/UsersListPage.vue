<template>
  <div class="container mt-20">
    <header class="text-center mt-5 mb-5">
      <h1 class="fw-bold">Lista użytkowników</h1>

      <p class="lead text-muted">
        Zarządzaj kontami użytkowników, edytuj ich dane i utrzymuj aktualność informacji.
      </p>
    </header>

    <section class="user-list-card shadow-sm p-4 bg-light rounded-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0" :style="{ color: primaryColor }">Użytkownicy</h3>

        <button
          @click="loadUsers"
          class="btn btn-refresh"
          :style="{ backgroundColor: primaryColor, borderColor: primaryColor }"
        >
          Odśwież
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-header">
            <tr>
              <th>Email</th>

              <th>Rola</th>

              <th>Imię</th>

              <th>Nazwisko</th>

              <th class="text-center">Akcje</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id" class="table-row">
              <td>{{ user.email }}</td>

              <td>{{ user.role }}</td>

              <td>{{ user.firstName }}</td>

              <td>{{ user.secondName }}</td>

              <td class="text-center">
                <button @click="editUser(user)" class="btn-action edit">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button @click="removeUser(user.id)" class="btn-action delete">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UserForm v-if="selectedUser" :user="selectedUser" @saved="onUserSaved" class="mt-4" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import userService from '@/api/services/usersService';
import UserForm from '@/components/UserForm.vue';
import type { User } from '@/api/types/user';
import { useConfirm } from '@/composables/useConfirm';

const primaryColor = '#ff5666';
const users = ref<User[]>([]);
const selectedUser = ref<User | null>(null);

async function loadUsers() {
  users.value = await userService.getAll();
}

function editUser(user: User) {
  selectedUser.value = { ...user };
}

const { confirm } = useConfirm();

async function removeUser(id: string) {
  const isConfirmed = await confirm(
    'Usuwanie użytkownika',
    'Czy na pewno chcesz usunąć tego użytkownika?',
    { confirmText: 'Tak, usuń', cancelText: 'Nie, wróć' },
  );

  if (!isConfirmed) {
    return;
  }

  await userService.delete(id);
  await loadUsers();
}

function onUserSaved() {
  selectedUser.value = null;
  loadUsers();
}

onMounted(loadUsers);
</script>

<style scoped>
.user-list-card {
  border-radius: 12px;
  background: #fff;
}

.table-header {
  background: linear-gradient(to right, #ff5666, #e14b59);
  color: white;
}

.table-row:hover {
  background-color: rgba(255, 86, 102, 0.05);
  transition: background 0.3s ease;
}

.btn-refresh {
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-refresh:hover {
  background-color: #e14b59;
}

.btn-action {
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action.edit {
  background-color: #ffc107;
  color: #333;
}

.btn-action.edit:hover {
  background-color: #ffb300;
}

.btn-action.delete {
  background-color: #dc3545;
  color: white;
}

.btn-action.delete:hover {
  background-color: #c82333;
}
</style>
