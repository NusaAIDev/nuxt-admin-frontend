<template>
  <div class="container-fluid py-4" v-if="template">
    <!-- Header/Navigation -->
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-3">
        <NuxtLink :to="`/customers/${customerId}/templates`" class="btn btn-white border border-light-subtle shadow-xs rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px">
          <i class="bi bi-arrow-left fs-5"></i>
        </NuxtLink>
        <div>
          <h2 class="fw-bold text-dark mb-1">{{ template.name }}</h2>
          <div class="d-flex align-items-center gap-2">
            <span class="badge px-3 py-1 rounded-pill extra-small" :class="getStatusBadgeClass(template.status)">
              <span class="status-dot-sm me-1" :class="'bg-' + getStatusColor(template.status)"></span>
              {{ template.status.toUpperCase() }}
            </span>
            <span class="text-secondary opacity-50 extra-small">|</span>
            <span class="badge bg-light text-secondary border extra-small fw-bold px-2 py-1 rounded-2">{{ template.category }}</span>
            <span class="text-secondary opacity-50 extra-small">|</span>
            <span class="text-secondary small">Language: <span class="fw-bold text-dark">{{ template.language.toUpperCase() }}</span></span>
          </div>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-white border border-light-subtle shadow-xs d-flex align-items-center gap-2 px-3 py-2 rounded-3">
          <i class="bi bi-pencil-square"></i>
          <span class="small fw-bold">Edit Content</span>
        </button>
      </div>
    </div>

    <div class="row g-4">
      <!-- Preview Column (Mockup) -->
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm h-100 rounded-4 overflow-hidden border-light">
          <div class="card-header bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-eye text-primary"></i>
              <h6 class="fw-bold mb-0 text-dark">Live Visual Preview</h6>
            </div>
            <div class="badge bg-light text-dark border extra-small px-3 py-1 rounded-pill fw-medium">WhatsApp Cloud API</div>
          </div>
          <div class="card-body bg-preview-grid d-flex align-items-center justify-content-center p-5">
            <!-- Mobile Phone Container -->
            <div class="mobile-frame-premium shadow-2xl">
              <div class="mobile-screen-content">
                <!-- WhatsApp Header -->
                <div class="wa-header-premium p-3 d-flex align-items-center">
                  <i class="bi bi-chevron-left me-2 text-white"></i>
                  <div class="wa-avatar-mock me-2">WA</div>
                  <div class="wa-recipient-info">
                    <div class="wa-recipient-name small fw-bold text-white lh-1">Official Support</div>
                    <div class="wa-recipient-status extra-small text-white opacity-75">Business Account</div>
                  </div>
                  <div class="ms-auto d-flex gap-3 text-white opacity-75">
                    <i class="bi bi-camera-video"></i>
                    <i class="bi bi-telephone"></i>
                    <i class="bi bi-three-dots-vertical"></i>
                  </div>
                </div>
                <!-- WhatsApp Chat Area -->
                <div class="wa-chat-canvas p-3 flex-grow-1 overflow-auto">
                  <div class="wa-date-divider text-center mb-3">
                    <span class="badge bg-white-50 text-secondary extra-small px-3 py-1 rounded-2 shadow-xs">Today</span>
                  </div>
                  
                  <!-- WhatsApp Bubble -->
                  <div class="wa-bubble-premium shadow-sm mb-2">
                    <div v-for="component in template.components" :key="component.type">
                      <!-- Header -->
                      <div v-if="component.type === 'HEADER'" class="wa-comp-header fw-bold mb-2 text-dark border-bottom pb-1">
                        {{ component.text }}
                      </div>
                      <!-- Body -->
                      <div v-if="component.type === 'BODY'" class="wa-comp-body text-dark whitespace-pre-wrap small mb-1">
                        {{ replaceParamsPreview(component.text || '') }}
                      </div>
                      <!-- Footer -->
                      <div v-if="component.type === 'FOOTER'" class="wa-comp-footer text-muted mt-2" style="font-size: 0.65rem">
                        {{ component.text }}
                      </div>
                      <!-- Buttons -->
                      <div v-if="component.type === 'BUTTONS'" class="wa-comp-buttons mt-3 border-top pt-1 mx-n3 mb-n3 bg-light-faint">
                        <div v-for="btn in component.buttons" :key="btn.text" class="wa-comp-button text-primary text-center py-2 bg-white small border-bottom-0">
                          <i v-if="btn.type === 'URL'" class="bi bi-box-arrow-up-right me-2 extra-small"></i>
                          <i v-else-if="btn.type === 'PHONE_NUMBER'" class="bi bi-telephone me-2 extra-small"></i>
                          <i v-else class="bi bi-reply me-2 extra-small"></i>
                          <span class="fw-medium">{{ btn.text }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-end mt-1 pe-1">
                      <span class="extra-small text-muted opacity-50" style="font-size: 0.6rem">10:45 AM <i class="bi bi-check2-all text-info ms-1"></i></span>
                    </div>
                  </div>
                </div>
                <!-- WhatsApp Entry Mock -->
                <div class="wa-entry-mock p-2 bg-white d-flex align-items-center gap-2 border-top">
                  <i class="bi bi-emoji-smile fs-5 text-secondary opacity-50 ms-1"></i>
                  <div class="bg-light rounded-pill flex-grow-1 px-3 py-1 text-muted small">Message</div>
                  <i class="bi bi-paperclip fs-5 text-secondary opacity-50"></i>
                  <div class="wa-send-circle-mock">
                    <i class="bi bi-mic-fill text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings / Test Column -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
          <div class="card-header bg-white py-3 px-4 border-bottom">
            <h6 class="fw-bold mb-0 text-dark">Metadata & Parameters</h6>
          </div>
          <div class="card-body p-4">
            <div class="row g-4">
              <div class="col-6">
                <div class="p-3 bg-light rounded-3 border border-light-subtle h-100">
                  <label class="text-secondary extra-small fw-bold text-uppercase mb-2 d-block tracking-wider">Classification</label>
                  <div class="text-dark fw-bold d-flex align-items-center gap-2">
                    <i class="bi bi-tags text-primary"></i>
                    {{ template.category }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3 border border-light-subtle h-100">
                  <label class="text-secondary extra-small fw-bold text-uppercase mb-2 d-block tracking-wider">Language</label>
                  <div class="text-dark fw-bold d-flex align-items-center gap-2">
                    <i class="bi bi-globe text-primary"></i>
                    {{ template.language.toUpperCase() }}
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="p-3 bg-light rounded-3 border border-light-subtle">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <label class="text-secondary extra-small fw-bold text-uppercase mb-1 d-block tracking-wider">Last Synced</label>
                      <div class="text-dark small fw-medium">{{ formatDateFull(template.lastSynced) }}</div>
                    </div>
                    <i class="bi bi-arrow-repeat text-secondary opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 overflow-hidden highlight-card">
          <div class="card-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <h6 class="fw-bold mb-0 text-white">Test Send Sandbox</h6>
            <div class="badge bg-white text-primary rounded-pill px-3 py-1 extra-small fw-bold shadow-xs">API v16.0</div>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleSendTest">
              <div class="mb-4">
                <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">Recipient Phone Number</label>
                <div class="input-group shadow-xs rounded-3 overflow-hidden border">
                  <span class="input-group-text bg-white border-0 ps-3"><i class="bi bi-telephone text-primary opacity-50"></i></span>
                  <input
                    v-model="testForm.phoneNumber"
                    type="text"
                    class="form-control border-0 py-2 shadow-none"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                <div class="form-text extra-small text-muted mt-2">Format: +[CountryCode][Number] (e.g., +628123456789)</div>
              </div>

              <div v-if="parameters.length > 0" class="mb-4">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-0">Template Variables</label>
                  <span class="badge bg-primary-subtle text-primary extra-small">{{ parameters.length }} required</span>
                </div>
                <div class="bg-light p-3 rounded-4 border border-light-subtle">
                  <div v-for="(param, index) in parameters" :key="param" class="mb-3 last-child-mb-0">
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <span class="extra-small fw-bold text-primary opacity-75">{{ param }}</span>
                    </div>
                    <input
                      v-model="testForm.params[param]"
                      type="text"
                      class="form-control form-control-sm border-0 border-bottom bg-white rounded-0 px-0 shadow-none focus-border-primary"
                      :placeholder="'Value for ' + param"
                      @input="handlePreviewUpdate"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm transition-all border-0 mt-2"
                :disabled="templateStore.loading"
              >
                <div v-if="templateStore.loading" class="spinner-border spinner-border-sm"></div>
                <i v-else class="bi bi-rocket-takeoff-fill"></i>
                <span>Dispatch Test Message</span>
              </button>

              <transition name="up-fade">
                <div v-if="sentSuccess" class="alert-premium-success mt-4 p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
                  <div class="success-icon-container">
                    <i class="bi bi-check2"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-bold small lh-1 mb-1">Success! Message Dispatched</div>
                    <div class="extra-small opacity-75">Check the status in Integration Logs.</div>
                  </div>
                </div>
              </transition>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="templateStore.loading" class="d-flex flex-column align-items-center justify-content-center" style="min-height: 500px">
    <div class="spinner-grow text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
    <div class="text-secondary fw-bold tracking-widest text-uppercase" style="font-size: 0.6rem">Compiling Preview Engine...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTemplateStore } from "~/stores/template";
import { useHead } from '#imports';

const route = useRoute();
const templateStore = useTemplateStore();
const customerId = route.params.id as string;
const templateId = route.params.templateId as string;

const template = computed(() => templateStore.currentTemplate);
const sentSuccess = ref(false);

const parameters = computed(() => {
  if (!template.value) return [];
  const body = template.value.components.find((c) => c.type === "BODY");
  if (!body || !body.text) return [];

  const matches = body.text.match(/\{\{\d+\}\}/g);
  return matches ? [...new Set(matches)] : [];
});

const testForm = reactive({
  phoneNumber: "",
  params: {} as Record<string, string>,
});

const handleSendTest = async () => {
  const success = await templateStore.sendTestTemplate(
    customerId,
    template.value!.name,
    testForm.phoneNumber,
    { ...testForm.params },
  );

  if (success) {
    sentSuccess.value = true;
    setTimeout(() => {
      sentSuccess.value = false;
    }, 5000);
  }
};

const handlePreviewUpdate = () => {
  // Triggers reactivity
};

const replaceParamsPreview = (text: string) => {
  let result = text;
  parameters.value.forEach(p => {
    const val = testForm.params[p];
    if (val) {
      result = result.replace(new RegExp(p.replace(/[{}]/g, '\\$&'), 'g'), `[${val}]`);
    }
  });
  return result;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "approved": return "bg-success-subtle text-success border border-success-subtle";
    case "pending": return "bg-warning-subtle text-warning border border-warning-subtle";
    case "rejected": return "bg-danger-subtle text-danger border border-danger-subtle";
    default: return "bg-secondary-subtle text-secondary border border-secondary-subtle";
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

const formatDateFull = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

onMounted(async () => {
  await templateStore.fetchTemplateById(templateId);
});

useHead({ title: `${template.value?.name || 'Template'} | WhatsApp Admin` });
</script>

<style scoped>
.bg-preview-grid {
  background-color: #f8fafc;
  background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
  background-size: 20px 20px;
}
.mobile-frame-premium {
  width: 330px;
  height: 650px;
  background-color: #1a1a1a;
  border-radius: 48px;
  border: 12px solid #2d2d2d;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
  width: 32px;
  height: 32px;
  background-color: #008069;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
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
  padding: 12px;
  max-width: 88%;
  position: relative;
}
.wa-comp-button {
  background-color: #fff;
  border-top: 1px solid #f2f2f2;
}
.wa-entry-mock {
  background-color: #f0f2f5;
}
.wa-send-circle-mock {
  width: 34px;
  height: 34px;
  background-color: #00a884;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-dot-sm {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.extra-small {
  font-size: 0.7rem;
}
.btn-white {
  background-color: white;
}
.highlight-card {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}
.highlight-card .form-label {
  color: rgba(255, 255, 255, 0.7) !important;
}
.focus-border-primary:focus {
  border-color: #2563eb !important;
}
.bg-light-faint {
  background-color: #fafafa;
}
.alert-premium-success {
  background-color: #ecfdf5;
  border: 1px solid #10b981;
  color: #065f46;
}
.success-icon-container {
  width: 28px;
  height: 28px;
  background-color: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.last-child-mb-0:last-child {
  margin-bottom: 0 !important;
}

.up-fade-enter-active,
.up-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.up-fade-enter-from,
.up-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
