import { createRouter, createWebHistory } from 'vue-router';

import Home from '../Views/Home.vue';
import About from '../Views/About.vue';
import Contact from '../Views/Contact.vue';
import Login from '../Views/Authentication/Login.vue';
import Register from '../Views/Authentication/Register.vue';
import CompanyRegister from '../Views/Authentication/CompanyRegister.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/o-nas', name: 'About', component: About },
  { path: '/kontakt', name: 'Contact', component: Contact },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/company-register', name: 'Company register', component: CompanyRegister },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
