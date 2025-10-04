import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { ref } from 'vue';

export const isRedirecting = ref(false);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/Views/HomePage.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/o-nas', name: 'About', component: () => import('@/Views/AboutPage.vue') },
  { path: '/kontakt', name: 'Contact', component: () => import('@/Views/ContactPage.vue') },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/Views/Authentication/LoginPage.vue'),
    meta: { hideNavFooter: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/Views/Authentication/RegisterPage.vue'),
    meta: { hideNavFooter: true },
  },
  {
    path: '/company-register',
    name: 'Company register',
    component: () => import('@/Views/Authentication/CompanyRegister.vue'),
    meta: { hideNavFooter: true },
  },
  {
    path: '/oferty',
    name: 'Oferty pracy',
    component: () => import('@/Views/JobOffers/JobOffers.vue'),
  },
  {
    path: '/pomoc',
    name: 'Pomoc',
    component: () => import('@/Views/HelpPage.vue'),
  },
  {
    path: '/generator',
    name: 'Generator',
    component: () => import('@/Views/JobDescriptionGenerator.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/Views/Authentication/LogoutPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/partnerzy',
    name: 'Partnerzy',
    component: () => import('@/Views/PartnersPage.vue'),
  },
  {
    path: '/polityka-plikow-cookies',
    name: 'Polityka plików cookies',
    component: () => import('@/Views/CookiePolicyPage.vue'),
  },
  {
    path: '/polityka-prywatnosci',
    name: 'Polityka prywatności',
    component: () => import('@/Views/PrivacyPolicyPage.vue'),
  },
  {
    path: '/regulamin',
    name: 'Regulamin',
    component: () => import('@/Views/TermsOfServicePage.vue'),
  },
  {
    path: '/profil',
    name: 'Profil',
    component: () => import('@/Views/UserProfilePage.vue'),
  },
  {
    path: '/ustawienia',
    name: 'Ustawienia',
    component: () => import('@/Views/SettingsPage.vue'),
  },
  {
    path: '/zapisane',
    name: 'Zapisane',
    component: () => import('@/Views/SavedJobsPage.vue'),
  },
  {
    path: '/pracodawcy',
    name: 'Pracodawcy',
    component: () => import('@/Views/EmployersPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const auth = useAuth();

  if (to.meta.requiresAuth && !auth.isLoggedIn.value && from.path === '/login') {
    isRedirecting.value = true;
    next('/login');
  } else if (to.meta.requiresAuth && auth.isLoggedIn.value) {
    next();
  } else if (!to.meta.requiresAuth) {
    next();
  } else {
    isRedirecting.value = true;
    next('/login');
  }
});

router.afterEach(() => {
  isRedirecting.value = false;
});

export default router;
