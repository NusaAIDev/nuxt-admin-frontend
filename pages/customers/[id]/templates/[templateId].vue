<template>
  <div v-if="template">
    <!-- <div class="mb-4">
      <NuxtLink :to="`/customers/${customerId}/templates`" class="btn btn-sm btn-white border shadow-sm mb-3">
        <i class="bi bi-arrow-left me-1"></i> Back to Templates
      </NuxtLink>
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h4 class="fw-bold mb-1">{{ template.name }}</h4>
          <div class="d-flex align-items-center gap-2">
            <span :class="getStatusClass(template.status)">{{ template.status.toUpperCase() }}</span>
            <span class="badge bg-secondary-subtle text-secondary">{{ template.category }}</span>
            <span class="text-muted small">| Language: {{ template.language.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div> -->

    <div class="row g-4">
      <!-- Preview Column -->
      <div class="col-md-7">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white py-3 border-bottom">
            <h6 class="fw-bold mb-0">Template Content</h6>
          </div>
          <div class="card-body bg-light rounded-bottom p-4">
            <!-- WhatsApp Bubble Mockup -->
            <div
              class="whatsapp-bubble shadow-sm p-3 bg-white mx-auto"
              style="max-width: 400px; border-radius: 0 15px 15px 15px"
            >
              <div
                v-for="component in template.components"
                :key="component.type"
                class="mb-2"
              >
                <!-- Header -->
                <div
                  v-if="component.type === 'HEADER'"
                  class="fw-bold mb-1 text-dark border-bottom pb-1 mb-2"
                >
                  {{ component.text }}
                </div>
                <!-- Body -->
                <div
                  v-if="component.type === 'BODY'"
                  class="text-dark whitespace-pre-wrap"
                >
                  {{ component.text }}
                </div>
                <!-- Footer -->
                <div
                  v-if="component.type === 'FOOTER'"
                  class="text-muted small mt-2"
                >
                  {{ component.text }}
                </div>
                <!-- Buttons -->
                <div
                  v-if="component.type === 'BUTTONS'"
                  class="mt-3 border-top pt-2"
                >
                  <div
                    v-for="btn in component.buttons"
                    :key="btn.text"
                    class="d-grid mb-1"
                  >
                    <button
                      class="btn btn-sm btn-outline-primary border-0 bg-light-subtle d-flex align-items-center justify-content-center"
                    >
                      <i
                        v-if="btn.type === 'URL'"
                        class="bi bi-box-arrow-up-right me-2"
                      ></i>
                      <i v-else class="bi bi-reply me-2"></i>
                      {{ btn.text }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="text-end">
                <span class="extra-small text-muted">10:20 AM</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white py-3 border-bottom">
            <h6 class="fw-bold mb-0">Detected Parameters</h6>
          </div>
          <div class="card-body">
            <div v-if="parameters.length > 0">
              <div
                v-for="param in parameters"
                :key="param"
                class="d-flex align-items-center mb-2"
              >
                <span class="badge bg-primary me-3">{{ param }}</span>
                <span class="text-secondary small"
                  >Needs value mapping during send</span
                >
              </div>
            </div>
            <div v-else class="text-muted small">
              No parameters detected in this template.
            </div>
          </div>
        </div>
      </div>

      <!-- Test Send Column -->
      <div class="col-md-5">
        <div class="card border-0 shadow-sm sticky-top" style="top: 20px">
          <div class="card-header bg-white py-3 border-bottom">
            <h6 class="fw-bold mb-0">Send Test Message</h6>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSendTest">
              <div class="mb-3">
                <label class="form-label small fw-bold"
                  >Recipient Phone Number</label
                >
                <input
                  v-model="testForm.phoneNumber"
                  type="text"
                  class="form-control"
                  placeholder="+628123456789"
                  required
                />
                <div class="form-text extra-small">
                  Include country code (e.g., +62)
                </div>
              </div>

              <div v-if="parameters.length > 0" class="mb-4">
                <label class="form-label small fw-bold">Parameter Values</label>
                <div v-for="param in parameters" :key="param" class="mb-2">
                  <div class="input-group input-group-sm">
                    <span class="input-group-text bg-light">{{ param }}</span>
                    <input
                      v-model="testForm.params[param]"
                      type="text"
                      class="form-control"
                      :placeholder="'Value for ' + param"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-success w-100 d-flex align-items-center justify-content-center"
                :disabled="templateStore.loading"
              >
                <i
                  v-if="templateStore.loading"
                  class="spinner-border spinner-border-sm me-2"
                ></i>
                <i v-else class="bi bi-send me-2"></i>
                Send Test Template
              </button>

              <div
                v-if="sentSuccess"
                class="alert alert-success mt-3 py-2 small d-flex align-items-center"
              >
                <i class="bi bi-check-circle-fill me-2"></i>
                Test message sent successfully!
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="templateStore.loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateStore } from "~/stores/template";

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

const getStatusClass = (status: string) => {
  switch (status) {
    case "approved":
      return "badge bg-success-subtle text-success";
    case "pending":
      return "badge bg-warning-subtle text-warning";
    case "rejected":
      return "badge bg-danger-subtle text-danger";
    default:
      return "badge bg-secondary-subtle text-secondary";
  }
};

onMounted(async () => {
  await templateStore.fetchTemplateById(templateId);
});
</script>

<style scoped>
.whatsapp-bubble {
  position: relative;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.extra-small {
  font-size: 0.75rem;
}
.btn-white {
  background-color: white;
}
</style>
