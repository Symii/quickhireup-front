<template>
  <footer>
    <div class="container footer-columns">
      <div v-if="isCandidate">
        <h4>Dla kandydatów</h4>

        <ul>
          <li><RouterLink to="/oferty">Oferty pracy</RouterLink></li>

          <li><RouterLink to="/moje-aplikacje">Moje aplikacje</RouterLink></li>

          <li><RouterLink to="/pomoc">Pomoc</RouterLink></li>
        </ul>
      </div>

      <div v-if="isCompany">
        <h4>Dla firm</h4>

        <ul>
          <li><RouterLink to="/firma/dodaj-ogloszenie">Dodaj ogłoszenie</RouterLink></li>

          <li><RouterLink to="/firma/moje-ogloszenia">Moje ogłoszenia</RouterLink></li>
        </ul>
      </div>
      <div>
        <h4>QuickHireUp</h4>

        <ul>
          <li><RouterLink to="/o-nas">O nas</RouterLink></li>

          <li><RouterLink to="/kontakt">Kontakt</RouterLink></li>

          <li><RouterLink to="/partnerzy">Partnerzy</RouterLink></li>
        </ul>
      </div>

      <div v-if="isCompany || isAdmin">
        <h4>Narzędzia</h4>

        <ul>
          <li v-if="isCompany"><RouterLink to="/generator">Generator opisów</RouterLink></li>

          <li v-if="isAdmin">
            <RouterLink to="/admin/stworz-szablon">Kreator szablonów</RouterLink>
          </li>

          <li v-if="isAdmin"><RouterLink to="/admin/uzytkownicy">Użytkownicy</RouterLink></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      © QuickHireUp &nbsp;&nbsp;•&nbsp;&nbsp;

      <RouterLink to="/regulamin">Regulamin</RouterLink>

      &nbsp;&nbsp;•&nbsp;&nbsp;

      <RouterLink to="/polityka-prywatnosci">Polityka Prywatności</RouterLink>

      &nbsp;&nbsp;•&nbsp;&nbsp;

      <RouterLink to="/polityka-plikow-cookies">Polityka plików cookies</RouterLink>
    </div>
  </footer>
</template>

<script setup lang="ts">
import accountService from '@/api/services/accountService';
import { RoleName } from '@/constants/RoleNames';
import { computed, onMounted, ref } from 'vue';

const currentUser = ref<{ role: string } | null>(null);
const isAdmin = computed(() => currentUser.value?.role === RoleName.ADMIN);
const isCompany = computed(() => currentUser.value?.role === RoleName.COMPANY);
const isCandidate = computed(() => currentUser.value?.role === RoleName.CANDIDATE);

onMounted(async () => {
  currentUser.value = await accountService.getCurrentUser();
});
</script>

<style>
footer {
  background: #fff;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
}
.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}
.footer-columns h4 {
  color: #fc4c4e;
  margin-bottom: 0.5rem;
}
.footer-columns ul {
  list-style: none;
  padding: 0;
}
.footer-columns li {
  margin-bottom: 0.4rem;
}
.footer-bottom {
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}
a:link,
a:visited {
  text-decoration: none;
  color: #212529;
}

a:hover {
  text-decoration: underline;
  color: #000000;
}
</style>
