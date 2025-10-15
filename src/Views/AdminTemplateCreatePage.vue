<template>
  <div class="container mt-20">
    <header class="form-header text-center mb-5">
      <h1>Szablony ogłoszeń o pracę</h1>

      <p class="lead">Tutaj możesz tworzyć, edytować i usuwać gotowe szablony ogłoszeń.</p>
    </header>

    <section class="row justify-content-center">
      <div class="col-md-5 mb-4">
        <div class="form-card shadow-sm p-4">
          <h4>Lista szablonów</h4>

          <div v-if="templates.length === 0" class="text-muted">Brak zdefiniowanych szablonów.</div>

          <ul class="list-group mt-3">
            <li
              v-for="tpl in templates"
              :key="tpl.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ tpl.name }}</strong>

                <br />

                <small class="text-muted">{{ tpl.jobTitle }}</small>
              </div>

              <div>
                <button class="btn btn-sm btn-outline-primary me-2" @click="editTemplate(tpl)">
                  Edytuj
                </button>

                <button class="btn btn-sm btn-outline-danger" @click="deleteTemplate(tpl.id)">
                  Usuń
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-card shadow-sm p-4">
          <h4>{{ editingTemplate ? 'Edycja szablonu' : 'Nowy szablon' }}</h4>

          <form @submit.prevent="saveTemplate">
            <div class="mb-3">
              <label class="form-label">Nazwa szablonu</label>

              <input
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />

              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Stanowisko</label>

              <input
                v-model="form.jobTitle"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.jobTitle }"
              />

              <div class="invalid-feedback">{{ errors.jobTitle }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Doświadczenie</label>

              <select
                v-model="form.experience"
                class="form-control"
                :class="{ 'is-invalid': errors.experience }"
              >
                <option disabled value="">Wybierz</option>

                <option>Brak doświadczenia</option>

                <option>Do 1 roku</option>

                <option>1-3 lata</option>

                <option>3-5 lat</option>

                <option>Powyżej 5 lat</option>
              </select>

              <div class="invalid-feedback">{{ errors.experience }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Rodzaj umowy</label>

              <select
                v-model="form.contractType"
                class="form-control"
                :class="{ 'is-invalid': errors.contractType }"
              >
                <option disabled value="">Wybierz</option>

                <option>Umowa o pracę</option>

                <option>Umowa zlecenie</option>

                <option>Umowa o dzieło</option>

                <option>Kontrakt B2B</option>
              </select>

              <div class="invalid-feedback">{{ errors.contractType }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Rodzaj pracy</label>

              <select
                v-model="form.employmentType"
                class="form-control"
                :class="{ 'is-invalid': errors.employmentType }"
              >
                <option disabled value="">Wybierz</option>

                <option>Zdalnie</option>

                <option>Stacjonarnie</option>

                <option>Hybrydowo</option>
              </select>

              <div class="invalid-feedback">{{ errors.employmentType }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Wynagrodzenie</label>

              <input
                v-model="form.salary"
                type="text"
                class="form-control"
                placeholder="Np. 7000–9000 zł"
                :class="{ 'is-invalid': errors.salary }"
              />

              <div class="invalid-feedback">{{ errors.salary }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Obowiązki</label>

              <textarea
                v-model="form.responsibilities"
                rows="3"
                class="form-control"
                :class="{ 'is-invalid': errors.responsibilities }"
              ></textarea>

              <div class="invalid-feedback">{{ errors.responsibilities }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Wymagania</label>

              <textarea
                v-model="form.qualifications"
                rows="3"
                class="form-control"
                :class="{ 'is-invalid': errors.qualifications }"
              ></textarea>

              <div class="invalid-feedback">{{ errors.qualifications }}</div>
            </div>

            <div class="text-end">
              <button class="btn btn-secondary me-2" type="button" @click="resetForm">
                Wyczyść
              </button>

              <button class="btn btn-primary" type="submit">
                {{ editingTemplate ? 'Zapisz zmiany' : 'Dodaj szablon' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';

interface TemplateForm {
  id?: string;
  name: string;
  jobTitle: string;
  experience: string;
  contractType: string;
  employmentType: string;
  salary: string;
  responsibilities: string;
  qualifications: string;
}

export default {
  setup() {
    const templates = ref<TemplateForm[]>(JSON.parse(localStorage.getItem('jobTemplates') || '[]'));
    const editingTemplate = ref<TemplateForm | null>(null);

    const form = reactive<TemplateForm>({
      name: '',
      jobTitle: '',
      experience: '',
      contractType: '',
      employmentType: '',
      salary: '',
      responsibilities: '',
      qualifications: '',
    });

    const errors = reactive<Record<string, string>>({});

    const validate = () => {
      Object.keys(errors).forEach((k) => (errors[k] = ''));
      if (!form.name) errors.name = 'Podaj nazwę szablonu.';
      if (!form.jobTitle) errors.jobTitle = 'Podaj nazwę stanowiska.';
      if (!form.experience) errors.experience = 'Wybierz doświadczenie.';
      if (!form.contractType) errors.contractType = 'Wybierz rodzaj umowy.';
      if (!form.employmentType) errors.employmentType = 'Wybierz rodzaj pracy.';
      if (!form.salary) errors.salary = 'Podaj wynagrodzenie.';
      if (!form.responsibilities) errors.responsibilities = 'Podaj obowiązki.';
      if (!form.qualifications) errors.qualifications = 'Podaj wymagania.';
      return Object.values(errors).every((v) => !v);
    };

    const saveToStorage = () =>
      localStorage.setItem('jobTemplates', JSON.stringify(templates.value));

    const saveTemplate = () => {
      if (!validate()) return;
      if (editingTemplate.value) {
        const idx = templates.value.findIndex((t) => t.id === editingTemplate.value?.id);
        if (idx !== -1) templates.value[idx] = { ...form, id: editingTemplate.value.id };
        editingTemplate.value = null;
      } else {
        templates.value.push({ ...form, id: Date.now().toString() });
      }
      saveToStorage();
      resetForm();
      alert('✅ Szablon zapisany!');
    };

    const editTemplate = (tpl: TemplateForm) => {
      Object.assign(form, tpl);
      editingTemplate.value = tpl;
    };

    const deleteTemplate = (id: string) => {
      if (confirm('Czy na pewno chcesz usunąć ten szablon?')) {
        templates.value = templates.value.filter((t) => t.id !== id);
        saveToStorage();
      }
    };

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        jobTitle: '',
        experience: '',
        contractType: '',
        employmentType: '',
        salary: '',
        responsibilities: '',
        qualifications: '',
      });
      editingTemplate.value = null;
    };

    return {
      templates,
      form,
      errors,
      editingTemplate,
      saveTemplate,
      editTemplate,
      deleteTemplate,
      resetForm,
    };
  },
};
</script>

<style scoped>
.form-header {
  background: linear-gradient(135deg, #ff5666, #e14b59);
  color: white;
  padding: 2.5rem 1rem;
  border-radius: 1rem;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  transition: 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

button.btn-primary {
  background-color: #ff5666;
  border-color: #ff5666;
}

button.btn-primary:hover {
  background-color: #e14b59;
}

.mt-20 {
  margin-top: 20px;
}

.is-invalid {
  border-color: #dc3545 !important;
}
.invalid-feedback {
  color: #dc3545;
  font-size: 0.85rem;
}
</style>
