<template>
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink to="/" class="logo">quickhireup.pl</RouterLink>

      <ul class="nav-links">
        <li><RouterLink to="/oferty">Oferty pracy</RouterLink></li>

        <li><RouterLink to="/pracodawcy">Profile pracodawców</RouterLink></li>
      </ul>
    </div>

    <div class="hamburger" @click="toggleMobileMenu">&#9776;</div>

    <div class="navbar-right">
      <div class="favorites-icon" style="font-size: 30px">
        <RouterLink to="/zapisane">★</RouterLink>
      </div>

      <div class="account-wrapper" ref="accountWrapper">
        <div class="account-btn" @click="toggleDropdown">
          Moje konto <span class="arrow">▼</span>
        </div>

        <div v-if="dropdownOpen" class="nav-dropdown-menu">
          <ul>
            <li><RouterLink to="/profil">Profil</RouterLink></li>

            <li><RouterLink to="/ustawienia">Ustawienia</RouterLink></li>

            <li><RouterLink to="/logout">Wyloguj się</RouterLink></li>
          </ul>
        </div>
      </div>

      <div class="for-companies">
        <span>DLA FIRM</span>

        <RouterLink to="/firma/dodaj-ogloszenie">Dodaj ogłoszenie</RouterLink>
      </div>
    </div>

    <transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-header">
          <RouterLink to="/" class="logo">quickhireup.pl</RouterLink>

          <button class="close-btn" @click="toggleMobileMenu">&times;</button>
        </div>

        <ul class="mobile-nav-links">
          <li>
            <RouterLink @click.native="toggleMobileMenu" to="/oferty"> Oferty pracy </RouterLink>
          </li>

          <li>
            <RouterLink @click.native="toggleMobileMenu" to="/pracodawcy">
              Profile pracodawców
            </RouterLink>
          </li>

          <li>
            <RouterLink @click.native="toggleMobileMenu" to="/zapisane">
              Zapisane ogłoszenia
            </RouterLink>
          </li>

          <li><RouterLink @click.native="toggleMobileMenu" to="/profil">Profil</RouterLink></li>

          <li>
            <RouterLink @click.native="toggleMobileMenu" to="/ustawienia">Ustawienia</RouterLink>
          </li>

          <li>
            <RouterLink @click.native="toggleMobileMenu" to="/logout">Wyloguj się</RouterLink>
          </li>

          <li class="for-companies-mobile">
            <span>DLA FIRM</span>

            <a href="#" @click.prevent>Dodaj ogłoszenie</a>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';

const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdown() {
  dropdownOpen.value = false;
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;

  if (mobileMenuOpen.value) {
    closeDropdown();
  }
}

const accountWrapper = ref(null);

function onClickOutside(event) {
  if (accountWrapper.value && !accountWrapper.value.contains(event.target)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-around !important;
  align-items: center;
  padding: 10px 24px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  position: relative;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  background-color: #fc4c4e;
  color: white !important;
  font-weight: bold;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 20px;
  white-space: nowrap;
  text-decoration: none;
}

a:hover {
  text-decoration: none !important;
  opacity: 0.9;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0;
}

.nav-links li {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
}

.arrow {
  font-size: 10px;
  margin-left: 4px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.favorites-icon {
  font-size: 18px;
  cursor: pointer;
}

.favorites-icon a {
  color: var(--text-muted) !important;
}

.account-btn {
  background-color: #fc4c4e;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.for-companies {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 11px;
  margin-left: 10px;
}

.for-companies a {
  color: #fc4c4e !important;
  font-weight: bold;
  text-decoration: none;
  font-size: 13px;
}

.account-wrapper {
  position: relative;
}

.nav-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  margin-top: 6px;
  width: 150px;
  z-index: 1000;
}

.nav-dropdown-menu ul {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.nav-dropdown-menu li {
  padding: 8px 16px;
  font-size: 14px;
}

.nav-dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.nav-dropdown-menu a {
  color: #333;
  text-decoration: none;
  display: block;
}

.hamburger {
  display: none;
  font-size: 30px;
  cursor: pointer;
  user-select: none;
  color: #fc4c4e;
  margin-right: 10px;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  padding: 5px;
  overflow-y: auto;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.close-btn {
  font-size: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: #fc4c4e;
  line-height: 1;
  padding: 0;
}

.mobile-nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 18px;
}

.mobile-nav-links li {
  display: flex;
  flex-direction: column;
}

.mobile-nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
}

.mobile-nav-links a:hover {
  color: #fc4c4e;
}

.for-companies-mobile {
  font-size: 14px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.for-companies-mobile span {
  font-weight: bold;
  color: #666;
}

.for-companies-mobile a {
  color: #fc4c4e;
  font-weight: bold;
  text-decoration: none;
}

@media (max-width: 767px) {
  .nav-links,
  .navbar-right {
    display: none;
  }

  .hamburger {
    display: block;
  }

  .navbar {
    justify-content: space-between !important;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
