<template>
  <div class="form-wrapper">
    <div class="form-card">
      <h2 class="title">Formularz opisu stanowiska</h2>

      <form @submit.prevent="submitForm" class="job-form" novalidate>
        <div class="input-group">
          <label for="jobTitle">Tytuł stanowiska</label>
          <input
            id="jobTitle"
            type="text"
            v-model="form.jobTitle"
            placeholder="Np. Specjalista ds. marketingu"
            required
          />
        </div>

        <div class="input-group">
          <label for="location">Lokalizacja</label>
          <input
            id="location"
            type="text"
            v-model="form.location"
            placeholder="Np. Warszawa"
            required
          />
        </div>

        <div class="input-group">
          <label for="experience">Wymagania kluczowe (doświadczenie)</label>
          <select id="experience" v-model="form.experience" required>
            <option disabled value="">Wybierz wymagania</option>
            <option value="Brak doświadczenia">Brak doświadczenia</option>
            <option value="Do 1 roku">Do 1 roku</option>
            <option value="1-3 lata">1-3 lata</option>
            <option value="3-5 lat">3-5 lat</option>
            <option value="Powyżej 5 lat">Powyżej 5 lat</option>
          </select>
        </div>

        <div class="input-group">
          <label for="contractType">Rodzaj umowy</label>
          <select id="contractType" v-model="form.contractType" required>
            <option disabled value="">Wybierz rodzaj umowy</option>
            <option value="Umowa o pracę">Umowa o pracę</option>
            <option value="Umowa zlecenie">Umowa zlecenie</option>
            <option value="Umowa o dzieło">Umowa o dzieło</option>
            <option value="Kontrakt B2B">Kontrakt B2B</option>
          </select>
        </div>

        <div class="input-group">
          <label for="employmentType">Rodzaj zatrudnienia</label>
          <select id="employmentType" v-model="form.employmentType" required>
            <option disabled value="">Wybierz rodzaj zatrudnienia</option>
            <option value="Zdalnie">Zdalnie</option>
            <option value="Stacjonarnie">Stacjonarnie</option>
            <option value="Hybrydowo">Hybrydowo</option>
          </select>
        </div>

        <button type="submit" class="btn-submit">Wygeneruj opis stanowiska</button>
      </form>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div
        class="modal-card modal-fade"
        :class="{ show: modalVisible }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <header class="modal-header">
          <h3 id="modalTitle">Opis stanowiska</h3>
        </header>
        <main class="modal-content">
          <template v-if="loading">
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <p>Trwa generowanie...</p>
            </div>
          </template>
          <template v-else>
            <pre class="generated-text">{{ generatedDescription }}</pre>
          </template>
        </main>
        <footer class="modal-footer" v-if="!loading">
          <button @click="copyToClipboard" class="btn-copy">Kopiuj</button>
          <button @click="closeModal" class="btn-exit">Wyjdź</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        location: '',
        jobTitle: '',
        experience: '',
        contractType: '',
        employmentType: '',
      },
      loading: false,
      showModal: false,
      modalVisible: false,
      generatedDescription: '',
    };
  },
  methods: {
    async submitForm() {
      if (
        !this.form.location ||
        !this.form.jobTitle ||
        !this.form.experience ||
        !this.form.contractType ||
        !this.form.employmentType
      ) {
        alert('Proszę wypełnić wszystkie pola.');
        return;
      }

      this.loading = true;
      this.modalVisible = false;
      this.showModal = true;
      await this.$nextTick();
      this.modalVisible = true;

      const requestData = {
        jobTitle: this.form.jobTitle,
        location: this.form.location,
        experience: this.form.experience,
        contractType: this.form.contractType,
        employmentType: this.form.employmentType,
      };

      try {
        const response = await fetch('https://localhost:7184/api/JobDescription/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Błąd serwera: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        this.generatedDescription = data.description || data.Description || 'Brak opisu z serwera';
      } catch (error) {
        this.generatedDescription = `Wystąpił błąd podczas generowania opisu: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    async closeModal() {
      this.modalVisible = false;
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.showModal = false;
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.generatedDescription).then(() => {
        alert('Opis został skopiowany do schowka!');
      });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap');

.form-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
}

.form-card {
  background: #fff;
  border-radius: 1.2rem;
  padding: 3rem 3.5rem;
  max-width: 80vw;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(255, 86, 102, 0.15);
}

.title {
  font-size: 2.4rem;
  font-weight: 700;
  color: rgb(255, 86, 102);
  margin-bottom: 2rem;
}

.job-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.input-group label {
  font-weight: 500;
  color: #4a4a4a;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #d3d3d3;
  border-radius: 0.6rem;
  font-size: 1rem;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  outline: none;
  font-family: 'Poppins', sans-serif;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: rgb(255, 86, 102);
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.5);
}

.btn-submit {
  background: rgb(255, 86, 102);
  color: white;
  font-weight: 600;
  padding: 1rem 0;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(255, 86, 102, 0.4);
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
  width: 100%;
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background: rgb(255, 86, 102);
  box-shadow: 0 8px 20px rgba(255, 86, 102, 0.6);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  background: white;
  border-radius: 1rem;
  max-width: 1000px;
  width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(255, 86, 102, 0.3);
  overflow: hidden;
}

.modal-fade {
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.modal-fade.show {
  opacity: 1;
  transform: scale(1);
}

.modal-header {
  background: rgb(255, 86, 102);
  padding: 1rem 1.5rem;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  user-select: none;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: 'Poppins', sans-serif;
  color: #333;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.generated-text {
  white-space: pre-wrap;
  font-size: 1rem;
  line-height: 1.4;
  width: 100%;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f7f7f7;
}

.btn-copy,
.btn-exit {
  font-weight: 600;
  border-radius: 0.6rem;
  padding: 0.7rem 1.4rem;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: background 0.3s ease;
}

.btn-copy {
  background: rgb(255, 86, 102);
  color: white;
  box-shadow: 0 5px 15px rgba(255, 86, 102, 0.4);
}

.btn-copy:hover {
  background: rgb(255, 86, 102);
  box-shadow: 0 8px 20px rgba(255, 86, 102, 0.6);
}

.btn-exit {
  background: #ccc;
  color: #333;
}

.btn-exit:hover {
  background: #b3b3b3;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid rgb(255, 86, 102);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-container p {
  font-size: 1.2rem;
  color: rgb(255, 86, 102);
  font-weight: 600;
  margin: 0;
}

.input-group select {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #d3d3d3;
  border-radius: 0.6rem;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  outline: none;
  background-color: white;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23666' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 10px 6px;
  cursor: pointer;
}

.input-group select:focus {
  border-color: rgb(255, 86, 102);
  box-shadow: 0 0 8px rgba(255, 86, 102, 0.5);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 450px) {
  .form-card {
    padding: 2rem 2rem;
  }
  .title {
    font-size: 2rem;
  }
}

@media (max-width: 767px) {
  .form-card {
    max-width: 100vw;
  }
}
</style>
