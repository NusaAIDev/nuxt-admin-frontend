<template>
  <div class="container-fluid py-4" v-if="template">
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
      <div class="d-flex align-items-center gap-3">
        <NuxtLink
          :to="`/organization/${customerId}/templates`"
          class="btn btn-light border rounded-circle d-flex align-items-center justify-content-center"
          style="width: 42px; height: 42px"
        >
          <i class="bi bi-arrow-left fs-5"></i>
        </NuxtLink>
        <div>
          <h3 class="fw-bold mb-1">{{ template.name }}</h3>
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="badge" :class="getStatusBadgeClass(template.status)">
              {{ template.status.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <span
          class="badge text-uppercase px-3 py-2 d-flex align-items-center"
          :class="isEditingContent ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'"
        >
          {{ isEditingContent ? "Edit Mode" : "View Mode" }}
        </span>
        <button v-if="!isEditingContent" class="btn btn-outline-primary" @click="isEditingContent = true">
          <i class="bi bi-pencil-square me-1"></i> Edit Content
        </button>
        <template v-else>
          <button class="btn btn-primary" @click="saveContent">
            <i class="bi bi-check-lg me-1"></i> Save
          </button>
          <button class="btn btn-light border" @click="cancelEditContent">Cancel</button>
        </template>
      </div>
    </div>

    <div class="alert py-2 mb-4" :class="isEditingContent ? 'alert-warning' : 'alert-secondary'">
      {{ isEditingContent
        ? "Editing aktif. Perubahan konten template akan disimpan saat klik Save."
        : "Read-only mode. Klik Edit Content untuk mengubah isi template." }}
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold mb-0">Template Content</h6>
          </div>
          <div class="card-body">
            <label class="form-label fw-semibold text-secondary small">Message Body <span class="text-danger">*</span></label>
            <textarea
              v-model="editableBody"
              class="form-control"
              rows="8"
              :readonly="!isEditingContent"
              placeholder="Template message content"
            ></textarea>
            <div class="form-text mt-2">
              Gunakan placeholder seperti <code v-pre>{{1}}</code>, <code v-pre>{{2}}</code> untuk variable.
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mt-4">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold mb-0">Preview</h6>
          </div>
          <div class="card-body">
            <div class="preview-box">
              {{ replaceParamsPreview(editableBody) }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold mb-0">Info</h6>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between py-2 border-bottom">
              <span class="text-secondary small">Status</span>
              <span class="fw-semibold">{{ template.status.toUpperCase() }}</span>
            </div>
            <div class="d-flex justify-content-between py-2">
              <span class="text-secondary small">Last Synced</span>
              <span class="fw-semibold small">{{ formatDateFull(template.lastSynced) }}</span>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold mb-0">Send Test</h6>
          </div>
          <div class="card-body">
            <form ref="sendTestFormRef" @submit.prevent="openSendConfirm">
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Recipient Phone Number <span class="text-danger">*</span></label>
                <input
                  v-model="testForm.phoneNumber"
                  type="text"
                  class="form-control"
                  placeholder="+628123456789"
                  required
                />
              </div>

              <div v-if="parameters.length > 0" class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Template Variables <span class="text-danger">*</span></label>
                <div class="d-flex flex-column gap-2">
                  <input
                    v-for="param in parameters"
                    :key="param"
                    v-model="testForm.params[param]"
                    type="text"
                    class="form-control form-control-sm"
                    :placeholder="`Value for ${param}`"
                    required
                  />
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="templateStore.loading">
                <span v-if="templateStore.loading" class="spinner-border spinner-border-sm me-2"></span>
                Send Test Message
              </button>

              <div v-if="sentSuccess" class="alert alert-success mt-3 mb-0 py-2 small">
                Test message sent successfully.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSendConfirmModal" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <div class="modal-content-custom">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="fw-bold mb-0">Confirm Send Test Message</h6>
            <button type="button" class="btn-close shadow-none" @click="closeSendConfirm"></button>
          </div>
          <p class="text-secondary small mb-4">
            Are you sure you want to send this test template to
            <span class="fw-semibold text-dark">{{ testForm.phoneNumber || "-" }}</span>?
          </p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-light border" @click="closeSendConfirm">Cancel</button>
            <button class="btn btn-primary" @click="confirmSendTest" :disabled="templateStore.loading">
              <span v-if="templateStore.loading" class="spinner-border spinner-border-sm me-2"></span>
              Yes, Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="templateStore.loading" class="d-flex align-items-center justify-content-center" style="min-height: 320px">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTemplateStore } from "~/stores/template";
import { useHead } from "#imports";

const route = useRoute();
const templateStore = useTemplateStore();
const customerId = route.params.id as string;
const templateId = route.params.templateId as string;

const template = computed(() => templateStore.currentTemplate);
const isEditingContent = ref(false);
const editableBody = ref("");
const sentSuccess = ref(false);
const showSendConfirmModal = ref(false);
const sendTestFormRef = ref<HTMLFormElement | null>(null);

const parameters = computed(() => {
  const body = editableBody.value;
  const matches = body.match(/\{\{\d+\}\}/g);
  return matches ? [...new Set(matches)] : [];
});

const testForm = reactive({
  phoneNumber: "",
  params: {} as Record<string, string>,
});

watch(
  template,
  (value) => {
    if (!value) return;
    const bodyComponent = value.components.find((c) => c.type === "BODY");
    editableBody.value = bodyComponent?.text || "";
  },
  { immediate: true },
);

const saveContent = () => {
  if (!template.value) return;
  const bodyComponent = template.value.components.find((c) => c.type === "BODY");
  if (bodyComponent) {
    bodyComponent.text = editableBody.value;
  }
  isEditingContent.value = false;
};

const cancelEditContent = () => {
  if (!template.value) return;
  const bodyComponent = template.value.components.find((c) => c.type === "BODY");
  editableBody.value = bodyComponent?.text || "";
  isEditingContent.value = false;
};

const handleSendTest = async () => {
  if (!template.value) return;
  const success = await templateStore.sendTestTemplate(
    customerId,
    template.value.name,
    testForm.phoneNumber,
    { ...testForm.params },
  );

  if (success) {
    sentSuccess.value = true;
    setTimeout(() => {
      sentSuccess.value = false;
    }, 4000);
  }
};

const openSendConfirm = () => {
  if (!sendTestFormRef.value?.reportValidity()) {
    return;
  }
  showSendConfirmModal.value = true;
};

const closeSendConfirm = () => {
  showSendConfirmModal.value = false;
};

const confirmSendTest = async () => {
  showSendConfirmModal.value = false;
  await handleSendTest();
};

const replaceParamsPreview = (text: string) => {
  let result = text;
  parameters.value.forEach((p) => {
    const val = testForm.params[p];
    if (val) {
      result = result.replace(new RegExp(p.replace(/[{}]/g, "\\$&"), "g"), `[${val}]`);
    }
  });
  return result;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-success-subtle text-success border border-success-subtle";
    case "pending":
      return "bg-warning-subtle text-warning border border-warning-subtle";
    case "rejected":
      return "bg-danger-subtle text-danger border border-danger-subtle";
    default:
      return "bg-secondary-subtle text-secondary border border-secondary-subtle";
  }
};

const formatDateFull = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  await templateStore.fetchTemplateById(templateId);
});

useHead({ title: `${template.value?.name || "Template"} | WhatsApp Admin` });
</script>

<style scoped>
.preview-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.9rem 1rem;
  white-space: pre-wrap;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #1f2937;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 460px;
}

.modal-content-custom {
  background: #fff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.18);
}
</style>
