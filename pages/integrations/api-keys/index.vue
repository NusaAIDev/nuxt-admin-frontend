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
              <tr v-for="key in paginatedKeys" :key="key.id">
                <td class="ps-4 py-4">
                  <div class="fw-bold text-dark">{{ key.name }}</div>
                  <div class="text-secondary extra-small">{{ key.id }}</div>
                </td>
                <td class="py-4">
                  <span class="fw-medium text-dark">{{ key.provider }}</span>
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
                    <NuxtLink
                      :to="`/integrations/api-keys/${key.id}/show`"
                      class="btn btn-sm btn-white border shadow-sm px-3"
                    >
                      <i class="bi bi-pencil small"></i> Edit
                    </NuxtLink>
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
        <CommonAppPagination
          v-if="filteredKeys.length > 0"
          :total-items="filteredKeys.length"
          :current-page="currentPage"
          :per-page="perPage"
          @update:current-page="currentPage = $event"
          @update:per-page="perPage = $event"
        />

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

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

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
  {
    id: "ak_5531mr4",
    name: "Mistral Production",
    provider: "Mistral",
    environment: "Production",
    isActive: true,
    updatedAt: "2024-02-18T08:20:00Z",
  },
  {
    id: "ak_7742pp7",
    name: "Perplexity Ops",
    provider: "Perplexity",
    environment: "Production",
    isActive: true,
    updatedAt: "2024-02-16T13:05:00Z",
  },
  {
    id: "ak_1108oa3",
    name: "OpenAI Backup",
    provider: "OpenAI",
    environment: "Staging",
    isActive: false,
    updatedAt: "2024-02-02T11:10:00Z",
  },
]);

const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(5);

const filteredKeys = computed(() => {
  if (!searchQuery.value) return apiKeys.value;
  const query = searchQuery.value.toLowerCase();
  return apiKeys.value.filter((key) =>
    key.name.toLowerCase().includes(query)
  );
});

const paginatedKeys = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredKeys.value.slice(start, start + perPage.value);
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

function toggleStatus(key: ApiKey) {
  key.isActive = !key.isActive;
  key.updatedAt = new Date().toISOString();
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

.btn-white {
  background-color: #fff;
  color: #475569;
}
.btn-white:hover {
  background-color: #f8fafc;
  color: #1e293b;
}

.cursor-pointer { cursor: pointer; }
</style>
