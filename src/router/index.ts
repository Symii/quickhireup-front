import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { ref } from 'vue';

export const isRedirecting = ref(false);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/o-nas', name: 'About', component: () => import('@/views/About.vue') },
  { path: '/kontakt', name: 'Contact', component: () => import('@/views/Contact.vue') },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Authentication/Login.vue'),
    meta: { hideNavFooter: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Authentication/Register.vue'),
    meta: { hideNavFooter: true },
  },
  {
    path: '/company-register',
    name: 'Company register',
    component: () => import('@/views/Authentication/CompanyRegister.vue'),
    meta: { hideNavFooter: true },
  },
  {
    path: '/oferty',
    name: 'Oferty pracy',
    component: () => import('@/views/JobOffers/JobOffers.vue'),
  },
  {
    path: '/pomoc',
    name: 'Pomoc',
    component: () => import('@/views/HelpPage.vue'),
  },
  {
    path: '/generator',
    name: 'Generator',
    component: () => import('@/views/Generator.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuth();

  if (to.meta.requiresAuth && !auth.isLoggedIn.value) {
    isRedirecting.value = true;
    next('/login');
  } else {
    next();
  }
});

router.afterEach(() => {
  isRedirecting.value = false;
});

export default router;
