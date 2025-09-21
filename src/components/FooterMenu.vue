<template>
  <footer>
    <div class="container footer-columns">
      <div>
        <h4>Dla kandydatów</h4>

        <ul>
          <li><RouterLink to="/oferty">Oferty pracy</RouterLink></li>

          <li><RouterLink to="/pomoc">Pomoc</RouterLink></li>
        </ul>
      </div>

      <div>
        <h4>Dla firm</h4>

        <ul>
          <li><RouterLink to="/firma/dodaj-ogloszenie">Dodaj ogłoszenie</RouterLink></li>

          <li><RouterLink to="/firma/konto">Konto pracodawcy</RouterLink></li>
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

      <div>
        <h4>Narzędzia</h4>

        <ul>
          <li><RouterLink to="/generator">Generator opisów</RouterLink></li>
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

<style>
footer {
  background: #fff;
  padding: 2rem;
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
