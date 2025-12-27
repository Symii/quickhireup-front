import { useAuthStore } from '@/api/authentication/authStore';
import { createRouter, createWebHistory } from 'vue-router';

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: string[];
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/Views/HomePage.vue'),
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
    path: '/pomoc',
    name: 'Pomoc',
    component: () => import('@/Views/HelpPage.vue'),
  },
  {
    path: '/generator',
    name: 'Generator',
    component: () => import('@/Views/JobDescriptionGenerator.vue'),
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
  {
    path: '/ustawienia',
    name: 'Ustawienia',
    component: () => import('@/Views/SettingsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/zapisane',
    name: 'Zapisane',
    component: () => import('@/Views/SavedJobsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/pracodawcy',
    name: 'Pracodawcy',
    component: () => import('@/Views/EmployersPage.vue'),
  },
  {
    path: '/firma/dodaj-ogloszenie',
    name: 'Dodaj ogłoszenie',
    component: () => import('@/Views/JobAddPage.vue'),
    meta: { requiresAuth: true, roles: ['Company'] },
  },
  {
    path: '/firma/edytuj-ogloszenie/:id',
    name: 'Edytuj ogłoszenie',
    component: () => import('@/Views/JobAddPage.vue'),
    meta: { requiresAuth: true, roles: ['Company'] },
  },
  {
    path: '/admin/stworz-szablon',
    name: 'Stwórz szablon',
    component: () => import('@/Views/AdminTemplateCreatePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/oferty',
    name: 'Oferty pracy',
    component: () => import('@/Views/JobListPage.vue'),
  },
  {
    path: '/profil-pracodawcy/:id',
    name: 'Profil pracodawcy',
    component: () => import('@/Views/EmployerProfilePage.vue'),
  },
  {
    path: '/oferta/:id',
    name: 'Oferta pracy',
    component: () => import('@/Views/JobDetailsPage.vue'),
  },
  {
    path: '/aplikuj/:id',
    name: 'Aplikuj na stanowisko',
    component: () => import('@/Views/JobApplicationPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/firma/moje-ogloszenia',
    name: 'Moje ogłoszenia',
    component: () => import('@/Views/EmployerJobListPage.vue'),
    meta: { requiresAuth: true, roles: ['Company'] },
  },
  {
    path: '/firma/kandydaci/:jobId',
    name: 'Kandydaci na ogłoszenie',
    component: () => import('@/Views/JobCandidatesPage.vue'),
    meta: { requiresAuth: true, roles: ['Company'] },
  },
  {
    path: '/moje-aplikacje',
    name: 'Moje aplikacje',
    component: () => import('@/Views/CandidateApplicationsPage.vue'),
    meta: { requiresAuth: true, roles: ['Candidate'] },
  },
  {
    path: '/admin/uzytkownicy',
    name: 'Lista użytkowników',
    component: () => import('@/Views/UsersListPage.vue'),
    meta: { requiresAuth: true, roles: ['Admin'] },
  },
  {
    path: '/admin/wiadomosci',
    name: 'Lista wiadomości',
    component: () => import('@/Views/AdminContactMessages.vue'),
    meta: { requiresAuth: true, roles: ['Admin'] },
  },
  {
    path: '/job-success',
    name: 'job-success',
    component: () => import('@/Views/SuccessPage.vue'),
    props: (route: { query: { jobTitle: string; offerId: string } }) => ({
      title: 'Zapisano ogłoszenie',
      message: 'Twoje ogłoszenie zostało opublikowane:',
      highlight: route.query.jobTitle,
      icon: 'bi-check-circle-fill',
      primaryButtonText: 'Zobacz ogłoszenie',
      secondaryButtonText: 'Wróć do listy',
      onPrimaryClick: () => router.push(`/oferta/${route.query.offerId}`),
      onSecondaryClick: () => router.push('/'),
    }),
    meta: { requiresAuth: true, roles: ['Company'] },
  },
  {
    path: '/application-success',
    name: 'application-success',
    component: () => import('@/Views/SuccessPage.vue'),
    props: (route: { query: { jobTitle: string } }) => ({
      title: 'Aplikacja wysłana!',
      message: 'Twoje CV trafiło do pracodawcy. Powodzenia na wybranym stanowisku!',
      icon: 'bi-send-check-fill',
      primaryButtonText: 'Szukaj innych ofert',
      secondaryButtonText: 'Moje aplikacje',
      onPrimaryClick: () => router.push('/'),
      onSecondaryClick: () => router.push('/moje-aplikacje'),
    }),
  },
  {
    path: '/unauthorized',
    component: () => import('@/Views/ErrorPage.vue'),
    props: { type: '401', message: 'Nie masz wymaganych uprawnień.' },
  },
  {
    path: '/server-error',
    component: () => import('@/Views/ErrorPage.vue'),
    props: {
      type: '500',
      message:
        'Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę lub skontaktuj się z nami, aby zgłosić błąd.',
    },
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

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    await auth.fetchCurrentUser();
  }

  if (to.meta.requiresAuth && !auth.token) {
    return '/login';
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role ?? '')) {
    return '/unauthorized';
  }
});

export default router;
