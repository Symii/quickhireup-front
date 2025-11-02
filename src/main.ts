import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/main.css';
import { createPinia } from 'pinia';
import { useAuthStore } from './api/authentication/authStore';
import api from './api/services/api';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
router.isReady().then(() => {
  app.mount('#app');
});

const auth = useAuthStore();
if (auth.token) {
  api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
  auth.fetchCurrentUser();
}
