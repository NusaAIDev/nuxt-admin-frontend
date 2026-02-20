<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">WhatsApp Templates</h4>
        <p class="text-secondary small mb-0">Manage and test message templates from WhatsApp Cloud API</p>
      </div>
      <button 
        @click="handleSync" 
        class="btn btn-primary d-flex align-items-center"
        :disabled="templateStore.loading"
      >
        <i v-if="templateStore.loading" class="spinner-border spinner-border-sm me-2"></i>
        <i v-else class="bi bi-arrow-repeat me-2"></i>
        Sync from WhatsApp
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body p-3 text-center">
            <div class="text-secondary small mb-1">Total Templates</div>
            <div class="h4 fw-bold mb-0">{{ templateStore.templates.length }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body p-3 text-center">
            <div class="text-secondary small mb-1">Approved</div>
            <div class="h4 fw-bold mb-0 text-success">
              {{ templateStore.templates.filter(t => t.status === 'approved').length }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body p-3 text-center">
            <div class="text-secondary small mb-1">Pending</div>
            <div class="h4 fw-bold mb-0 text-warning">
              {{ templateStore.templates.filter(t => t.status === 'pending').length }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body p-3 text-center">
            <div class="text-secondary small mb-1">Usage Today</div>
            <div class="h4 fw-bold mb-0 text-primary">12</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Table -->
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Template Name</th>
            <th>Category</th>
            <th>Language</th>
            <th>Status</th>
            <th>Last Used</th>
            <th>Usage</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="template in templateStore.templates" :key="template.id">
            <td>
              <div class="fw-bold">{{ template.name }}</div>
              <div class="text-muted extra-small">ID: {{ template.id }}</div>
            </td>
            <td>
              <span class="badge bg-secondary-subtle text-secondary">{{ template.category }}</span>
            </td>
            <td>
              <span class="text-uppercase small">{{ template.language }}</span>
            </td>
            <td>
              <span :class="getStatusClass(template.status)">
                <i class="bi bi-dot"></i> {{ template.status.toUpperCase() }}
              </span>
            </td>
            <td>
              <span class="small text-muted">{{ template.lastUsed ? formatDate(template.lastUsed) : 'Never' }}</span>
            </td>
            <td>
              <div class="small fw-bold">{{ template.usageCount }}</div>
            </td>
            <td class="text-end">
              <NuxtLink :to="`/customers/${customerId}/templates/${template.id}`" class="btn btn-sm btn-white border shadow-sm">
                View & Test
              </NuxtLink>
            </td>
          </tr>
          <tr v-if="templateStore.templates.length === 0 && !templateStore.loading">
            <td colspan="7" class="text-center py-4 text-muted">
              No templates found. Click "Sync" to fetch from WhatsApp.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-3 text-end">
      <p class="text-muted extra-small">Last synced: {{ lastSyncedTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateStore } from '~/stores/template';

const route = useRoute();
const templateStore = useTemplateStore();
const customerId = route.params.id as string;

const lastSyncedTime = computed(() => {
  if (templateStore.templates.length > 0) {
    return formatDate(templateStore.templates[0].lastSynced);
  }
  return 'Never';
});

const handleSync = async () => {
  await templateStore.syncTemplates(customerId);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved': return 'badge bg-success-subtle text-success';
    case 'pending': return 'badge bg-warning-subtle text-warning';
    case 'rejected': return 'badge bg-danger-subtle text-danger';
    default: return 'badge bg-secondary-subtle text-secondary';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

onMounted(async () => {
  await templateStore.fetchTemplates(customerId);
});
</script>

<style scoped>
.extra-small {
  font-size: 0.75rem;
}
.btn-white {
  background-color: white;
}
</style>
