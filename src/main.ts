import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import { useAuth } from '@/composables/useAuth';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/main.css';

const app = createApp(App);
const auth = useAuth();
auth.initAuth();

app.use(router);
router.isReady().then(() => {
  app.mount('#app');
});
