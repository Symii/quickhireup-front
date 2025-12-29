<template>
  <div class="container mt-20">
    <header class="form-header text-center mb-5">
      <h1>Szablony ogłoszeń o pracę</h1>

      <p class="lead">Tutaj możesz tworzyć, edytować i usuwać gotowe szablony ogłoszeń.</p>
    </header>

    <section class="row justify-content-center mb-4">
      <div class="col-sm-12 col-lg-5 mb-4">
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

                <button class="btn btn-sm btn-outline-danger" @click="deleteTemplate(tpl.id!)">
                  Usuń
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-sm-12 col-lg-6">
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
              <label class="form-label">Tytuł stanowiska</label>

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
              <label class="form-label">Rodzaj zatrudnienia</label>

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
              <label class="form-label">Wynagrodzenie OD</label>

              <input
                v-model="form.salaryFrom"
                type="number"
                class="form-control"
                placeholder="Np. 7000"
                :class="{ 'is-invalid': errors.salaryFrom }"
              />

              <div class="invalid-feedback">{{ errors.salaryFrom }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Wynagrodzenie DO</label>

              <input
                v-model="form.salaryTo"
                type="number"
                class="form-control"
                placeholder="Np. 9000"
                :class="{ 'is-invalid': errors.salaryTo }"
              />

              <div class="invalid-feedback">{{ errors.salaryTo }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Opis stanowiska</label>

              <textarea
                v-model="form.description"
                rows="3"
                class="form-control"
                :class="{ 'is-invalid': errors.description }"
              ></textarea>

              <div class="invalid-feedback">{{ errors.description }}</div>
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

            <div class="mb-3">
              <label class="form-label">Oferujemy <small>(opcjonalnie)</small></label>

              <textarea
                v-model="form.benefits"
                rows="3"
                class="form-control"
                :class="{ 'is-invalid': errors.benefits }"
              ></textarea>

              <div class="invalid-feedback">{{ errors.benefits }}</div>
            </div>

            <div class="text-end">
              <button
                v-if="editingTemplate"
                type="button"
                class="btn btn-secondary me-2"
                @click="cancelEdit"
              >
                Anuluj
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
import api from '@/api/services/api';
import { useConfirm } from '@/composables/useConfirm';
import { useNotification } from '@/composables/useNotification';
import { reactive, ref, onMounted } from 'vue';

interface TemplateForm {
  id?: string;
  name: string;
  jobTitle: string;
  experience: string;
  contractType: string;
  employmentType: string;
  salaryFrom: number;
  salaryTo: number;
  description: string;
  qualifications: string;
  benefits?: string;
}

export default {
  setup() {
    const notification = useNotification();
    const templates = ref<TemplateForm[]>([]);
    const editingTemplate = ref<TemplateForm | null>(null);
    const apiUrl = 'http://localhost:5000/api/JobTemplates';

    const form = reactive<TemplateForm>({
      name: '',
      jobTitle: '',
      experience: '',
      contractType: '',
      employmentType: '',
      salaryFrom: 0,
      salaryTo: 0,
      description: '',
      qualifications: '',
      benefits: '',
    });

    const errors = reactive<Record<string, string>>({});

    const fetchTemplates = async () => {
      try {
        const response = await api.get(apiUrl);
        if (response.status === 200) {
          templates.value = await response.data;
        }
      } catch (error) {
        console.error(error);
        notification.showMessage('Błąd pobierania danych.', 'error');
      }
    };

    onMounted(() => {
      fetchTemplates();
    });

    const validate = () => {
      Object.keys(errors).forEach((k) => (errors[k] = ''));
      if (!form.name) errors.name = 'Podaj nazwę szablonu.';
      if (!form.jobTitle) errors.jobTitle = 'Podaj nazwę stanowiska.';
      if (!form.experience) errors.experience = 'Wybierz doświadczenie.';
      if (!form.contractType) errors.contractType = 'Wybierz rodzaj umowy.';
      if (!form.employmentType) errors.employmentType = 'Wybierz rodzaj pracy.';
      if (!form.salaryFrom) errors.salaryFrom = 'Podaj wynagrodzenie OD.';
      if (form.salaryTo && form.salaryTo < form.salaryFrom)
        errors.salaryTo = 'Wynagrodzenie DO musi być większe lub równe wynagrodzeniu OD.';
      if (!form.description) errors.description = 'Podaj opis stanowiska.';
      if (!form.qualifications) errors.qualifications = 'Podaj wymagania.';
      return Object.values(errors).every((v) => !v);
    };

    const resetForm = () => {
      form.name = '';
      form.jobTitle = '';
      form.experience = '';
      form.contractType = '';
      form.employmentType = '';
      form.salaryFrom = 0;
      form.salaryTo = 0;
      form.description = '';
      form.qualifications = '';
      form.benefits = '';
      delete form.id;
    };

    const cancelEdit = () => {
      editingTemplate.value = null;
      resetForm();
    };

    const saveTemplate = async () => {
      if (!validate()) return;

      try {
        let response;
        if (editingTemplate.value && editingTemplate.value.id) {
          response = await api.put(`${apiUrl}/${editingTemplate.value.id}`, {
            ...form,
            id: editingTemplate.value.id,
          });
        } else {
          response = await api.post(apiUrl, form);
        }

        if (response.status === 200 || response.status === 201) {
          notification.showMessage('Szablon zapisany pomyślnie.', 'success');
          await fetchTemplates();
          editingTemplate.value = null;
          resetForm();
        } else {
          notification.showMessage('Wystąpił błąd podczas zapisywania.', 'error');
        }
      } catch (error) {
        console.error(error);
        notification.showMessage('Wystąpił błąd połączenia.', 'error');
      }
    };

    const editTemplate = (tpl: TemplateForm) => {
      Object.assign(form, tpl);
      editingTemplate.value = tpl;
    };

    const { confirm } = useConfirm();

    const deleteTemplate = async (id: string) => {
      const isConfirmed = await confirm(
        'Usuwanie szablonu',
        'Czy na pewno chcesz usunąć ten szablon?',
        { confirmText: 'Tak, usuń', cancelText: 'Nie, wróć' },
      );

      if (!isConfirmed) {
        return;
      }

      try {
        const response = await api.delete(`${apiUrl}/${id}`);

        if (response.status === 200 || response.status === 204) {
          templates.value = templates.value.filter((t) => t.id !== id);
          if (editingTemplate.value?.id === id) {
            editingTemplate.value = null;
            resetForm();
          }
          notification.showMessage('Szablon usunięty.', 'success');
        } else {
          notification.showMessage('Nie udało się usunąć szablonu.', 'error');
        }
      } catch (error) {
        console.error(error);
        notification.showMessage('Błąd połączenia.', 'error');
      }
    };

    return {
      templates,
      form,
      errors,
      editingTemplate,
      saveTemplate,
      editTemplate,
      deleteTemplate,
      cancelEdit,
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
