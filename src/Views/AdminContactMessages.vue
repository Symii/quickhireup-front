<template>
  <div class="admin-messages container py-5">
    <header class="mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h1 class="display-6 fw-bold text-primary-gradient">Skrzynka odbiorcza</h1>

        <p class="text-muted" v-if="!selectedMessage">Zarządzaj wiadomościami od użytkowników</p>
      </div>

      <button
        v-if="selectedMessage"
        class="btn btn-outline-secondary"
        @click="selectedMessage = null"
      >
        Powrót do listy
      </button>
    </header>

    <div v-if="!selectedMessage" class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="bg-light">
              <tr>
                <th>Data</th>

                <th>Nadawca</th>

                <th>Temat</th>

                <th class="text-end">Akcje</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="msg in messages"
                :key="msg.id"
                @click="selectedMessage = msg"
                style="cursor: pointer"
              >
                <td class="align-middle">{{ formatDate(msg.createdAt) }}</td>

                <td class="align-middle">
                  <div class="fw-bold">{{ msg.name }}</div>

                  <small class="text-muted">{{ msg.email }}</small>
                </td>

                <td class="align-middle text-truncate" style="max-width: 300px">
                  {{ msg.subject }}
                </td>

                <td class="text-end align-middle">
                  <button class="btn btn-sm btn-light border">
                    <i class="fa-solid fa-eye text-primary"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="messages.length === 0 && !loading">
                <td colspan="4" class="text-center py-5 text-muted">Brak wiadomości w bazie.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
        <span class="text-muted small">Strona {{ currentPage }} z {{ totalPages }}</span>

        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="fetchMessages(currentPage - 1)">Poprzednia</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="fetchMessages(currentPage + 1)">Następna</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-else class="card shadow-sm border-0 message-detail-card">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">{{ selectedMessage.subject }}</h5>

        <span class="badge bg-light text-dark border">{{
          formatDate(selectedMessage.createdAt, true)
        }}</span>
      </div>

      <div class="card-body p-4">
        <div class="sender-info mb-4 p-3 bg-light rounded-3">
          <div class="row">
            <div class="col-md-6">
              <label class="small text-muted d-block">Od:</label>

              <strong>{{ selectedMessage.name }}</strong>
            </div>

            <div class="col-md-6">
              <label class="small text-muted d-block">E-mail:</label>

              <a :href="'mailto:' + selectedMessage.email">{{ selectedMessage.email }}</a>
            </div>
          </div>
        </div>

        <div class="message-content">
          <label class="small text-muted d-block mb-2">Treść wiadomości:</label>

          <p class="white-space-pre">{{ selectedMessage.message }}</p>
        </div>
      </div>

      <div class="card-footer bg-white text-end py-3">
        <a
          :href="'mailto:' + selectedMessage.email + '?subject=Re: ' + selectedMessage.subject"
          class="btn btn-primary"
        >
          <i class="fa-solid fa-paper-plane me-2"></i> Odpowiedz e-mailem
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/services/api';
import { useNotification } from '@/composables/useNotification';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const notification = useNotification();
const messages = ref<ContactMessage[]>([]);
const selectedMessage = ref<ContactMessage | null>(null);
const loading = ref(false);

const currentPage = ref(1);
const totalPages = ref(1);

const fetchMessages = async (page: number) => {
  if (page < 1 || (page > totalPages.value && totalPages.value > 0)) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.get(`http://localhost:5000/api/contact?page=${page}&pageSize=10`);
    messages.value = response.data.items;
    currentPage.value = response.data.currentPage;
    totalPages.value = response.data.totalPages;
  } catch {
    notification.showMessage('Nie udało się pobrać wiadomości.', 'error');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr: string, full: boolean = false) => {
  const date = new Date(dateStr);
  return full
    ? date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : date.toLocaleDateString('pl-PL');
};

onMounted(() => {
  fetchMessages(1);
});
</script>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(45deg, #ff5666, #e14b59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.table-hover tbody tr:hover {
  background-color: rgba(255, 86, 102, 0.03);
}

.message-detail-card {
  border-radius: 12px;
}

.white-space-pre {
  white-space: pre-wrap;
  line-height: 1.6;
}

.page-link {
  color: #ff5666;
  cursor: pointer;
}

.page-item.disabled .page-link {
  color: #ccc;
}

.btn-primary {
  background-color: #ff5666;
  border-color: #ff5666;
  color: white;
}

.btn-primary:hover {
  background-color: #e14b59;
}
</style>
