<template>
  <div>
    <div class="d-flex align-items-center gap-2 mb-4">
      <NuxtLink to="/integrations/api-keys" class="btn btn-white border shadow-sm">
        <i class="bi bi-arrow-left"></i>
      </NuxtLink>
      <h2 class="fw-bold text-dark mb-0">Edit API Key</h2>
    </div>

    <div v-if="!currentKey" class="alert alert-danger border-0 shadow-sm">
      API Key not found.
    </div>

    <div v-else class="card border-0 shadow-sm">
      <div class="card-body">
        <form @submit.prevent="saveChanges">
          <div class="mb-4">
            <label class="form-label fw-semibold text-dark small">Key Name (alias)</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control border shadow-sm bg-light-subtle py-2 px-3"
              required
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold text-dark small">Provider</label>
            <select
              v-model="form.provider"
              class="form-select border shadow-sm bg-light-subtle py-2 px-3"
              required
            >
              <option value="OpenAI">OpenAI</option>
              <option value="Anthropic">Anthropic</option>
              <option value="Google Gemini">Google Gemini</option>
              <option value="Mistral">Mistral</option>
              <option value="Perplexity">Perplexity</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold text-dark small">API Key</label>
            <div class="input-group">
              <input
                v-model="form.apiKey"
                :type="showFullKey ? 'text' : 'password'"
                class="form-control border shadow-sm bg-light-subtle py-2 px-3"
                placeholder="••••••••••••••••"
              />
              <button
                class="btn btn-white border border-start-0 shadow-sm"
                type="button"
                @click="showFullKey = !showFullKey"
              >
                <i class="bi" :class="showFullKey ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <div class="form-text mt-2 extra-small text-info">
              <i class="bi bi-info-circle me-1"></i>
              Leave blank to keep existing key. For security, full keys are never displayed after saving.
            </div>
          </div>

          <div class="mb-4">
            <div class="form-check form-switch d-flex align-items-center gap-3 ps-0">
              <label class="form-check-label fw-semibold text-dark small mb-0" for="activeToggle">Set as Active</label>
              <input
                v-model="form.isActive"
                class="form-check-input ms-0 mt-0 shadow-sm"
                type="checkbox"
                id="activeToggle"
                style="width: 40px; height: 20px"
              />
            </div>
          </div>

          <div class="mb-0">
            <label class="form-label fw-semibold text-dark small">Notes (optional)</label>
            <textarea
              v-model="form.notes"
              class="form-control border shadow-sm bg-light-subtle py-2 px-3"
              rows="4"
              placeholder="Additional context about this key..."
            ></textarea>
          </div>

          <div class="mt-4 pt-2 d-flex justify-content-end gap-2">
            <NuxtLink to="/integrations/api-keys" class="btn btn-white border shadow-sm px-4 py-2 fw-semibold">
              Cancel
            </NuxtLink>
            <button type="submit" class="btn btn-primary px-4 py-2 fw-semibold shadow-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  updatedAt: string;
  notes?: string;
}

const route = useRoute();
const router = useRouter();
const showFullKey = ref(false);

const apiKeys: ApiKey[] = [
  { id: 'ak_8291kj2', name: 'OpenAI Main Production', provider: 'OpenAI', isActive: true, updatedAt: '2024-02-15T10:30:00Z' },
  { id: 'ak_2190ml1', name: 'Anthropic Staging', provider: 'Anthropic', isActive: true, updatedAt: '2024-02-10T14:45:00Z' },
  { id: 'ak_0029xp9', name: 'Gemini Trial', provider: 'Google Gemini', isActive: false, updatedAt: '2024-01-20T09:15:00Z' },
  { id: 'ak_5531mr4', name: 'Mistral Production', provider: 'Mistral', isActive: true, updatedAt: '2024-02-18T08:20:00Z' },
  { id: 'ak_7742pp7', name: 'Perplexity Ops', provider: 'Perplexity', isActive: true, updatedAt: '2024-02-16T13:05:00Z' },
  { id: 'ak_1108oa3', name: 'OpenAI Backup', provider: 'OpenAI', isActive: false, updatedAt: '2024-02-02T11:10:00Z' },
];

const currentKey = apiKeys.find((item) => item.id === String(route.params.id));

const form = reactive({
  name: currentKey?.name || '',
  provider: currentKey?.provider || 'OpenAI',
  apiKey: '',
  isActive: currentKey?.isActive ?? true,
  notes: currentKey?.notes || '',
});

function saveChanges() {
  // Placeholder: in real app this submits to backend then returns to list.
  router.push('/integrations/api-keys');
}

useHead({
  title: `Edit API Key - ${currentKey?.name || 'Not Found'} | AI Admin`,
});
</script>

<style scoped>
.btn-white {
  background-color: #fff;
  color: #475569;
}

.btn-white:hover {
  background-color: #f8fafc;
  color: #1e293b;
}

.extra-small {
  font-size: 0.75rem;
}
</style>
