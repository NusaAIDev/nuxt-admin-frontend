<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-end mb-40">
      <div>
        <h2 class="fw-bold text-dark mb-2">API Keys</h2>
        <p class="text-secondary mb-0 fs-5">
          Manage credentials for external providers
        </p>
      </div>
      <div>
        <NuxtLink
          to="/integrations/api-keys/new"
          class="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 shadow-sm text-decoration-none"
        >
          <i class="bi bi-plus-lg"></i> Add Key
        </NuxtLink>
      </div>
    </div>

    <!-- Keys Table Card -->
    <div class="card border-0 shadow-sm overflow-hidden">
      <div class="card-header bg-white py-4 px-4 border-bottom-0">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h5 class="mb-0 fw-bold">Provider Keys</h5>
          </div>
          <div class="col-md-6">
            <div class="input-group search-input-group shadow-none">
              <span class="input-group-text bg-light border-0 px-3">
                <i class="bi bi-search text-secondary"></i>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control bg-light border-0 py-2 ps-0 shadow-none"
                placeholder="Search by key name..."
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card-body p-0">
        <div v-if="filteredKeys.length > 0" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 py-3 text-secondary fw-semibold extra-small text-uppercase">
                  Key Name
                </th>
                <th class="py-3 text-secondary fw-semibold extra-small text-uppercase">
                  Provider
                </th>
                <th class="py-3 text-secondary fw-semibold extra-small text-uppercase">
                  Environment
                </th>
                <th class="py-3 text-secondary fw-semibold extra-small text-uppercase">
                  Status
                </th>
                <th class="py-3 text-secondary fw-semibold extra-small text-uppercase">
                  Last Updated
                </th>
                <th class="pe-4 py-3 text-end text-secondary fw-semibold extra-small text-uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="key in filteredKeys" :key="key.id">
                <td class="ps-4 py-4">
                  <div class="fw-bold text-dark">{{ key.name }}</div>
                  <div class="text-secondary extra-small">{{ key.id }}</div>
                </td>
                <td class="py-4">
                  <div class="d-flex align-items-center gap-2">
                    <span
                      class="provider-icon d-flex align-items-center justify-content-center rounded-2 bg-light"
                      style="width: 32px; height: 32px"
                    >
                      <i :class="getProviderIcon(key.provider)" class="fs-5"></i>
                    </span>
                    <span class="fw-medium text-dark">{{ key.provider }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <span
                    v-if="key.environment"
                    class="badge px-3 py-2 rounded-pill fw-medium border-0"
                    :class="key.environment === 'Production' ? 'bg-primary-subtle text-primary' : 'bg-info-subtle text-info'"
                  >
                    {{ key.environment }}
                  </span>
                  <span v-else class="text-muted">–</span>
                </td>
                <td class="py-4">
                  <span
                    v-if="key.isActive"
                    class="badge bg-success-subtle text-success border-0 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                  >
                    <span class="dot bg-success"></span> Active
                  </span>
                  <span
                    v-else
                    class="badge bg-danger-subtle text-danger border-0 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                  >
                    <span class="dot bg-danger"></span> Inactive
                  </span>
                </td>
                <td class="py-4 text-secondary">
                  {{ formatDate(key.updatedAt) }}
                </td>
                <td class="pe-4 py-4 text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button
                      class="btn btn-sm btn-white border shadow-sm px-3"
                      @click="openModal(key)"
                    >
                      <i class="bi bi-pencil small"></i> Edit
                    </button>
                    <button
                      class="btn btn-sm px-3"
                      :class="key.isActive ? 'btn-outline-danger' : 'btn-outline-success'"
                      @click="toggleStatus(key)"
                    >
                      {{ key.isActive ? "Disable" : "Enable" }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <div
            class="empty-state-icon bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style="width: 80px; height: 80px"
          >
            <i class="bi bi-key text-secondary fs-1 opacity-25"></i>
          </div>
          <h4 class="fw-bold text-dark">No API keys configured</h4>
          <p class="text-secondary mb-4 mx-auto" style="max-width: 300px">
            Start by adding a credential for OpenAI, Anthropic, or other providers to enable AI features.
          </p>
          <NuxtLink
            to="/integrations/api-keys/new"
            class="btn btn-primary px-4 py-2 text-decoration-none"
          >
            <i class="bi bi-plus-lg me-2"></i> Add Key
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div
      v-if="showModal"
      class="modal-backdrop fade show"
      @click="closeModal"
    ></div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="modal fade"
      :class="{ show: showModal, 'd-block': showModal }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg p-3">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              {{ editingKey ? "Edit API Key" : "Add New API Key" }}
            </h5>
            <button
              type="button"
              class="btn-close shadow-none"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body py-4">
            <form @submit.prevent="saveKey">
              <!-- Key Name -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-dark small"
                  >Key Name (alias)</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control border shadow-sm bg-light-subtle py-2 px-3"
                  placeholder="e.g. OpenAI Main Prod"
                  required
                />
              </div>

              <!-- Provider -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-dark small"
                  >Provider</label
                >
                <select
                  v-model="form.provider"
                  class="form-select border shadow-sm bg-light-subtle py-2 px-3"
                  required
                >
                  <option value="" disabled>Select provider...</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="Google Gemini">Google Gemini</option>
                  <option value="Mistral">Mistral</option>
                  <option value="Perplexity">Perplexity</option>
                </select>
              </div>

              <!-- API Key -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-dark small"
                  >API Key</label
                >
                <div class="input-group">
                  <input
                    v-model="form.apiKey"
                    :type="showFullKey ? 'text' : 'password'"
                    class="form-control border shadow-sm bg-light-subtle py-2 px-3"
                    :placeholder="editingKey ? '••••••••••••••••' : 'Enter API Key'"
                    :required="!editingKey"
                  />
                  <button
                    class="btn btn-white border border-start-0 shadow-sm"
                    type="button"
                    @click="showFullKey = !showFullKey"
                  >
                    <i class="bi" :class="showFullKey ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
                <div v-if="editingKey" class="form-text mt-2 extra-small text-info">
                  <i class="bi bi-info-circle me-1"></i> Leave blank to keep existing key. For security, full keys are never displayed after saving.
                </div>
              </div>

              <!-- Environment -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-dark small"
                  >Environment (optional)</label
                >
                <select
                  v-model="form.environment"
                  class="form-select border shadow-sm bg-light-subtle py-2 px-3"
                >
                  <option value="">No environment</option>
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                </select>
              </div>

              <!-- Active Toggle -->
              <div class="mb-4">
                <div class="form-check form-switch d-flex align-items-center gap-3 ps-0">
                  <label class="form-check-label fw-semibold text-dark small mb-0 cursor-pointer" for="activeToggle">
                    Set as Active
                  </label>
                  <input
                    v-model="form.isActive"
                    class="form-check-input ms-0 mt-0 shadow-sm cursor-pointer"
                    type="checkbox"
                    id="activeToggle"
                    style="width: 40px; height: 20px"
                  />
                </div>
              </div>

              <!-- Notes -->
              <div class="mb-0">
                <label class="form-label fw-semibold text-dark small"
                  >Notes (optional)</label
                >
                <textarea
                  v-model="form.notes"
                  class="form-control border shadow-sm bg-light-subtle py-2 px-3"
                  rows="3"
                  placeholder="Additional context about this key..."
                ></textarea>
              </div>

              <div class="mt-4 pt-2 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-white border shadow-sm px-4 py-2 fw-semibold"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Disabling -->
    <div
      v-if="confirmDisableKey"
      class="modal-backdrop fade show"
      style="z-index: 1060"
    ></div>
    <div
      v-if="confirmDisableKey"
      class="modal fade"
      :class="{ show: confirmDisableKey, 'd-block': confirmDisableKey }"
      tabindex="-1"
      style="z-index: 1061"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg text-center p-4">
          <div class="mb-3 text-warning">
            <i class="bi bi-exclamation-triangle-fill fs-1"></i>
          </div>
          <h5 class="fw-bold mb-2">Disable API Key?</h5>
          <p class="text-secondary small mb-4">
            Features using this key will stop working until it's re-enabled.
          </p>
          <div class="d-flex gap-2">
            <button
              class="btn btn-white border shadow-sm flex-grow-1"
              @click="confirmDisableKey = null"
            >
              Cancel
            </button>
            <button class="btn btn-danger flex-grow-1" @click="proceedToggleStatus">
              Yes, Disable
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  environment: string;
  isActive: boolean;
  updatedAt: string;
  notes?: string;
}

// Mock Data
// ... same as before
const apiKeys = ref<ApiKey[]>([
  {
    id: "ak_8291kj2",
    name: "OpenAI Main Production",
    provider: "OpenAI",
    environment: "Production",
    isActive: true,
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "ak_2190ml1",
    name: "Anthropic Staging",
    provider: "Anthropic",
    environment: "Staging",
    isActive: true,
    updatedAt: "2024-02-10T14:45:00Z",
  },
  {
    id: "ak_0029xp9",
    name: "Gemini Trial",
    provider: "Google Gemini",
    environment: "Staging",
    isActive: false,
    updatedAt: "2024-01-20T09:15:00Z",
  },
]);

const searchQuery = ref("");
const showModal = ref(false);
const showFullKey = ref(false);
const editingKey = ref<ApiKey | null>(null);
const confirmDisableKey = ref<ApiKey | null>(null);
const copied = ref(false);

const form = reactive({
  name: "",
  provider: "",
  apiKey: "",
  environment: "",
  isActive: true,
  notes: "",
});

const filteredKeys = computed(() => {
  if (!searchQuery.value) return apiKeys.value;
  const query = searchQuery.value.toLowerCase();
  return apiKeys.value.filter((key) =>
    key.name.toLowerCase().includes(query)
  );
});

function openModal(key: ApiKey) {
  editingKey.value = key;
  form.name = key.name;
  form.provider = key.provider;
  form.apiKey = ""; // Masked on edit
  form.environment = key.environment;
  form.isActive = key.isActive;
  form.notes = key.notes || "";
  
  showFullKey.value = false;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function saveKey() {
  if (editingKey.value) {
    const index = apiKeys.value.findIndex((k) => k.id === editingKey.value?.id);
    if (index !== -1) {
      apiKeys.value[index] = {
        ...apiKeys.value[index],
        name: form.name,
        provider: form.provider,
        environment: form.environment,
        isActive: form.isActive,
        notes: form.notes,
        updatedAt: new Date().toISOString(),
      };
    }
  }
  closeModal();
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function toggleStatus(key: ApiKey) {
  if (key.isActive) {
    confirmDisableKey.value = key;
  } else {
    key.isActive = true;
    key.updatedAt = new Date().toISOString();
  }
}

function proceedToggleStatus() {
  if (confirmDisableKey.value) {
    confirmDisableKey.value.isActive = false;
    confirmDisableKey.value.updatedAt = new Date().toISOString();
    confirmDisableKey.value = null;
  }
}

function getProviderIcon(provider: string) {
  switch (provider.toLowerCase()) {
    case "openai":
      return "bi bi-openai";
    case "anthropic":
      return "bi bi-braces";
    case "google gemini":
      return "bi bi-stars";
    case "mistral":
      return "bi bi-wind";
    case "perplexity":
      return "bi bi-search-heart";
    default:
      return "bi bi-cloud";
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

useHead({
  title: "API Keys - Integrations | AI Admin",
});
</script>

<style scoped>
.mb-40 { margin-bottom: 40px; }
.mb-32 { margin-bottom: 32px; }

.search-input-group {
  max-width: 320px;
  margin-left: auto;
}

.extra-small {
  font-size: 0.75rem;
  letter-spacing: 0.025em;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.modal-backdrop.show {
  opacity: 0.5;
}

.btn-white {
  background-color: #fff;
  color: #475569;
}
.btn-white:hover {
  background-color: #f8fafc;
  color: #1e293b;
}

.cursor-pointer { cursor: pointer; }

/* Custom Bootstrap Icons mapping if specific ones aren't available */
.bi-openai::before { content: "\f57c"; } /* Using robot/AI-like icons as placeholders if needed */
</style>
