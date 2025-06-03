<template>
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink to="/"><div class="logo">quickhireup.pl</div></RouterLink>

      <ul class="nav-links">
        <li><RouterLink to="/oferty">Oferty pracy</RouterLink></li>

        <li><RouterLink to="/pracodawcy">Profile pracodawców</RouterLink></li>
      </ul>
    </div>

    <div class="navbar-right">
      <div class="favorites-icon" style="font-size: 30px">★</div>

      <div class="account-wrapper" style="position: relative" ref="accountWrapper">
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
        <a href="#">Dodaj ogłoszenie</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';

const dropdownOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdown() {
  dropdownOpen.value = false;
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
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  background-color: #ff5666;
  color: white;
  font-weight: bold;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 20px;
  margin-right: 24px;
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
  color: #888;
  cursor: pointer;
}

.account-btn {
  background-color: #ff5666;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.for-companies {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 11px;
  margin-left: 10px;
}

.for-companies a {
  color: #ff5666 !important;
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
</style>
