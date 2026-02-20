<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4 d-flex justify-content-between align-items-end">
      <div>
        <h2 class="fw-bold text-dark mb-1">WhatsApp Templates</h2>
        <p class="text-secondary mb-0 small">Manage and sync official message templates from your WhatsApp Cloud API account.</p>
      </div>
      <div class="d-flex gap-2">
        <NuxtLink
          :to="`/customers/${customerId}/templates/create`"
          class="btn btn-outline-primary px-4 d-flex align-items-center gap-2 shadow-sm rounded-3 bg-white"
        >
          <i class="bi bi-plus-lg fs-5"></i>
          <span class="fw-semibold">Create Template</span>
        </NuxtLink>
        <button
          @click="handleSync"
          class="btn btn-primary px-4 d-flex align-items-center gap-2 shadow-sm rounded-3"
          :disabled="templateStore.loading"
        >
          <div v-if="templateStore.loading" class="spinner-border spinner-border-sm"></div>
          <i v-else class="bi bi-arrow-repeat fs-5"></i>
          <span class="fw-semibold">Sync from WhatsApp</span>
        </button>
      </div>
    </div>


    <!-- Template Table -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-white py-4 px-4 border-bottom-0 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-dark">Template Repository</h5>
        <div class="badge bg-light text-secondary fw-normal py-2 px-3 border border-light-subtle rounded-pill extra-small">
          <i class="bi bi-clock-history me-1"></i> Last synced: {{ lastSyncedTime }}
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 py-3 text-secondary fw-bold extra-small text-uppercase tracking-wider">Template Identity</th>
                <th class="py-3 text-secondary fw-bold extra-small text-uppercase tracking-wider">Classification</th>
                <th class="py-3 text-secondary fw-bold extra-small text-uppercase tracking-wider">Language</th>
                <th class="py-3 text-secondary fw-bold extra-small text-uppercase tracking-wider">Meta Status</th>
                <th class="py-3 text-secondary fw-bold extra-small text-uppercase tracking-wider">Usage Stats</th>
                <th class="pe-4 py-3 text-end text-secondary fw-bold extra-small text-uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="template in templateStore.templates" :key="template.id" class="cursor-pointer" @click="navigateToDetails(template.id)">
                <td class="ps-4 py-3">
                  <div class="text-dark fw-bold mb-0">{{ template.name }}</div>
                  <div class="text-secondary extra-small opacity-75">UID: {{ template.id }}</div>
                </td>
                <td class="py-3">
                  <span class="badge bg-white text-secondary border border-light-subtle px-3 py-1 extra-small text-uppercase fw-bold rounded-pill shadow-xs">
                    {{ template.category }}
                  </span>
                </td>
                <td class="py-3">
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-dark text-white extra-small fw-bold px-2 py-1 rounded-3">{{ template.language.split('_')[0].toUpperCase() }}</span>
                    <span class="text-secondary extra-small">({{ template.language.split('_')[1] }})</span>
                  </div>
                </td>
                <td class="py-3">
                  <div :class="getStatusBadgeClass(template.status)" class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill extra-small fw-bold border-0">
                    <span class="status-dot" :class="'bg-' + getStatusColor(template.status)"></span>
                    {{ template.status.toUpperCase() }}
                  </div>
                </td>
                <td class="py-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="text-center">
                      <div class="text-dark fw-bold extra-small lh-1 mb-1">{{ template.usageCount }}</div>
                      <div class="text-secondary extra-small opacity-75 text-uppercase fw-semibold" style="font-size: 0.6rem">Sends</div>
                    </div>
                    <div class="border-start ps-3">
                      <div class="text-dark fw-semibold extra-small lh-1 mb-1">
                        {{ template.lastUsed ? formatDateShort(template.lastUsed) : 'N/A' }}
                      </div>
                      <div class="text-secondary extra-small opacity-75 text-uppercase fw-semibold" style="font-size: 0.6rem">Last Used</div>
                    </div>
                  </div>
                </td>
                <td class="pe-4 py-3 text-end">
                  <NuxtLink
                    :to="`/customers/${customerId}/templates/${template.id}`"
                    class="btn btn-sm btn-white border border-light-subtle shadow-xs px-3 py-1 rounded-3 extra-small fw-bold transition-all"
                    @click.stop
                  >
                    Manage & Test
                  </NuxtLink>
                </td>
              </tr>
              <tr v-if="templateStore.templates.length === 0 && !templateStore.loading">
                <td colspan="6" class="text-center py-5">
                  <div class="text-muted opacity-25 mb-3">
                    <i class="bi bi-whatsapp" style="font-size: 4rem"></i>
                  </div>
                  <h6 class="text-secondary fw-bold">No Templates Found</h6>
                  <p class="text-muted extra-small max-width-250 mx-auto">Your synced templates from Meta will appear here. Click sync to update.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTemplateStore } from "~/stores/template";
import { useHead, navigateTo } from '#imports';

const route = useRoute();
const templateStore = useTemplateStore();
const customerId = route.params.id as string;

const lastSyncedTime = computed(() => {
  if (templateStore.templates.length > 0 && templateStore.templates[0].lastSynced) {
    return new Date(templateStore.templates[0].lastSynced).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  }
  return "Never synchronized";
});

const handleSync = async () => {
  await templateStore.syncTemplates(customerId);
};

const navigateToDetails = (templateId: string) => {
  navigateTo(`/customers/${customerId}/templates/${templateId}`);
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "approved": return "bg-success-subtle text-success";
    case "pending": return "bg-warning-subtle text-warning";
    case "rejected": return "bg-danger-subtle text-danger";
    default: return "bg-secondary-subtle text-secondary";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "success";
    case "pending": return "warning";
    case "rejected": return "danger";
    default: return "secondary";
  }
};

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

onMounted(async () => {
  await templateStore.fetchTemplates(customerId);
});

useHead({ title: 'WhatsApp Templates Inventory | AI Admin' });
</script>

<style scoped>
.extra-small {
  font-size: 0.725rem;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.btn-white {
  background-color: #fff;
  color: #475569;
}
.btn-white:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1 !important;
  color: #1e293b;
}
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.2s ease;
}
.max-width-250 {
  max-width: 250px;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
</style>
