<template>
  <div class="container-fluid py-4">
    <div class="mb-4 d-flex justify-content-between align-items-end">
      <div>
        <h2 class="fw-bold text-dark mb-1">Welcome Message</h2>
        <p class="text-secondary mb-0 small">
          Regular Cloud API: only one synced template is used for onboarding.
        </p>
      </div>
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

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-white py-4 px-4 border-bottom-0 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-dark">Template Detail</h5>
        <div class="badge bg-light text-secondary fw-normal py-2 px-3 border border-light-subtle rounded-pill extra-small">
          <i class="bi bi-clock-history me-1"></i> Last synced: {{ lastSyncedTime }}
        </div>
      </div>

      <div class="card-body p-4" v-if="welcomeTemplate">
        <div class="row g-4">
          <div class="col-md-8">
            <div class="border rounded-3 p-3 h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success-subtle text-success text-uppercase">{{ welcomeTemplate.status }}</span>
              </div>
              <div class="text-secondary extra-small mb-1">Template Name</div>
              <div class="fw-bold text-dark mb-3">{{ welcomeTemplate.name }}</div>

              <div class="text-secondary extra-small mb-1">Message Body</div>
              <div class="bg-light rounded-3 p-3">
                {{ templateBody || 'No body content from synced template.' }}
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="border rounded-3 p-3 h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="text-secondary extra-small mb-1">Usage</div>
                <div class="h4 fw-bold mb-3">{{ welcomeTemplate.usageCount }}</div>

                <div class="text-secondary extra-small mb-1">Last Used</div>
                <div class="fw-medium mb-3">{{ welcomeTemplate.lastUsed ? formatDate(welcomeTemplate.lastUsed) : 'N/A' }}</div>

                <div class="text-secondary extra-small mb-1">Template ID</div>
                <div class="font-monospace small">{{ welcomeTemplate.id }}</div>
              </div>

              <NuxtLink
                :to="`/organization/${customerId}/templates/${welcomeTemplate.id}`"
                class="btn btn-outline-primary mt-3"
              >
                Manage & Test
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="card-body p-5 text-center" v-else>
        <div class="text-muted opacity-25 mb-3">
          <i class="bi bi-chat-square-text" style="font-size: 4rem"></i>
        </div>
        <h6 class="text-secondary fw-bold">Welcome message belum tersedia</h6>
        <p class="text-muted extra-small mb-0">Klik Sync from WhatsApp untuk mengambil template welcome message.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTemplateStore } from '~/stores/template';
import { useHead } from '#imports';

const route = useRoute();
const templateStore = useTemplateStore();
const customerId = route.params.id as string;

const welcomeTemplate = computed(() => {
  if (!templateStore.templates.length) return null;
  return (
    templateStore.templates.find((t) => t.name.toLowerCase().includes('welcome')) ||
    templateStore.templates[0]
  );
});

const templateBody = computed(() => {
  const template = welcomeTemplate.value;
  if (!template) return '';
  return template.components.find((component) => component.type === 'BODY')?.text || '';
});

const lastSyncedTime = computed(() => {
  if (welcomeTemplate.value?.lastSynced) {
    return new Date(welcomeTemplate.value.lastSynced).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return 'Never synchronized';
});

const handleSync = async () => {
  await templateStore.syncTemplates(customerId);
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

onMounted(async () => {
  await templateStore.fetchTemplates(customerId);
});

useHead({ title: 'Welcome Message | AI Admin' });
</script>

<style scoped>
.extra-small {
  font-size: 0.725rem;
}
</style>
