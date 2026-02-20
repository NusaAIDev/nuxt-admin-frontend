<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4 d-flex align-items-center gap-3">
      <NuxtLink :to="`/customers/${customerId}/templates`" class="btn btn-white border border-light-subtle shadow-xs rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px">
        <i class="bi bi-arrow-left fs-5"></i>
      </NuxtLink>
      <div>
        <h2 class="fw-bold text-dark mb-1">Create WhatsApp Template</h2>
        <p class="text-secondary mb-0 small">Draft a new message template for Meta's approval.</p>
      </div>
    </div>

    <div class="row g-4">
      <!-- Editor Column -->
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <div class="card-header bg-white py-3 px-4 border-bottom">
            <h6 class="fw-bold mb-0 text-dark">Template Structure</h6>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleCreate">
              <!-- Basic Config -->
              <div class="row g-3 mb-4">
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider">Template Name</label>
                  <input v-model="form.name" type="text" class="form-control" placeholder="e.g. order_confirmation_v2" required />
                  <div class="form-text extra-small">Lowercase, numbers, and underscores only.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider">Category</label>
                  <select v-model="form.category" class="form-select">
                    <option value="MARKETING">Marketing</option>
                    <option value="UTILITY">Utility</option>
                    <option value="AUTHENTICATION">Authentication</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider">Language</label>
                  <select v-model="form.language" class="form-select">
                    <option value="en_US">English (US)</option>
                    <option value="id_ID">Indonesian</option>
                  </select>
                </div>
              </div>

              <!-- Content Editor -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-0">Message Body</label>
                  <button type="button" class="btn btn-link text-primary p-0 extra-small fw-bold text-decoration-none" @click="insertVariable">
                    <i class="bi bi-plus-circle me-1"></i> Add Variable
                  </button>
                </div>
                <textarea v-model="form.body" class="form-control rounded-3" rows="6" placeholder="Hello {{1}}, your order {{2}} is ready!" required></textarea>
                <div class="form-text extra-small mt-2">Use {{1}}, {{2}} as placeholders for dynamic content.</div>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary px-4 py-2 fw-bold rounded-3 shadow-sm" :disabled="templateStore.loading">
                  <div v-if="templateStore.loading" class="spinner-border spinner-border-sm me-2"></div>
                  Submit for Approval
                </button>
                <NuxtLink :to="`/customers/${customerId}/templates`" class="btn btn-light px-4 py-2 fw-bold rounded-3">Cancel</NuxtLink>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Preview Column -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style="top: 20px">
          <div class="card-body bg-preview-grid d-flex align-items-center justify-content-center p-5">
            <div class="mobile-frame-premium shadow-2xl">
              <div class="mobile-screen-content">
                <div class="wa-header-premium p-3 d-flex align-items-center">
                  <div class="wa-avatar-mock me-2">WA</div>
                  <div class="wa-recipient-info">
                    <div class="wa-recipient-name small fw-bold text-white lh-1">Official Support</div>
                    <div class="wa-recipient-status extra-small text-white opacity-75">Business Account</div>
                  </div>
                </div>
                <div class="wa-chat-canvas p-3 flex-grow-1">
                  <div class="wa-bubble-premium shadow-sm mb-2">
                    <div class="wa-comp-body text-dark whitespace-pre-wrap small">
                      {{ form.body || 'Your message preview will appear here...' }}
                    </div>
                    <div class="text-end mt-1">
                      <span class="extra-small text-muted opacity-50" style="font-size: 0.6rem">Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTemplateStore } from "~/stores/template";
import { useHead, navigateTo } from '#imports';

const route = useRoute();
const templateStore = useTemplateStore();
const customerId = route.params.id as string;

const form = reactive({
  name: '',
  category: 'MARKETING',
  language: 'en_US',
  body: ''
});

const insertVariable = () => {
  const matches = form.body.match(/\{\{\d+\}\}/g);
  const nextNum = matches ? matches.length + 1 : 1;
  form.body += ` {{${nextNum}}}`;
};

const handleCreate = async () => {
  const payload = {
    name: form.name.toLowerCase().replace(/\s+/g, '_'),
    category: form.category as 'MARKETING' | 'UTILITY' | 'AUTHENTICATION',
    language: form.language,
    components: [
      { type: 'BODY', text: form.body }
    ] as any[]
  };

  const result = await templateStore.createTemplate(customerId, payload as any);
  if (result) {
    navigateTo(`/customers/${customerId}/templates`);
  }
};

useHead({ title: 'Create WhatsApp Template | AI Admin' });
</script>

<style scoped>
/* Reuse styles from detail page for consistency */
.bg-preview-grid {
  background-color: #f8fafc;
  background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
  background-size: 20px 20px;
}
.mobile-frame-premium {
  width: 280px;
  height: 540px;
  background-color: #1a1a1a;
  border-radius: 40px;
  border: 10px solid #2d2d2d;
  position: relative;
  overflow: hidden;
}
.mobile-screen-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.wa-header-premium {
  background-color: #075e54;
  color: white;
}
.wa-avatar-mock {
  width: 28px;
  height: 28px;
  background-color: #008069;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
}
.wa-chat-canvas {
  background-color: #e5ddd5;
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  background-size: cover;
}
.wa-bubble-premium {
  background-color: #fff;
  border-radius: 4px 18px 18px 18px;
  padding: 10px;
  max-width: 90%;
  position: relative;
}
.extra-small {
  font-size: 0.7rem;
}
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.btn-white {
  background-color: white;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
