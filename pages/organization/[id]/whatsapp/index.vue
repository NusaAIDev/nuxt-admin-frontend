<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">WhatsApp Integration</h4>
        <p class="text-secondary small mb-0">
          Monitor connection status and API details
        </p>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span
          class="badge text-uppercase px-3 py-2"
          :class="isEditing ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'"
        >
          {{ isEditing ? "Edit Mode" : "View Mode" }}
        </span>
        <template v-if="!isEditing">
          <button class="btn btn-outline-primary" @click="isEditing = true">
            <i class="bi bi-pencil-square me-1"></i> Edit
          </button>
        </template>
        <template v-else>
          <button class="btn btn-primary" @click="saveChanges" :disabled="saving">
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Save Changes
          </button>
          <button class="btn btn-light border" @click="cancelEdit" :disabled="saving">
            Cancel
          </button>
        </template>
      </div>
    </div>

    <div class="alert py-2 mb-4" :class="isEditing ? 'alert-warning' : 'alert-secondary'">
      {{ isEditing
        ? "Editing aktif. Status koneksi tetap otomatis dari Meta Cloud API."
        : "Read-only mode. Klik Edit untuk mengubah konfigurasi API." }}
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 fw-bold">Connection Details</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >WhatsApp Number <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-whatsapp text-success"></i
                  ></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.whatsappNumber"
                    :readonly="!isEditing"
                    placeholder="+6281234567890"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Meta Business ID <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.metaBusinessId"
                  :readonly="!isEditing"
                  placeholder="123456789012345"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Business Account ID <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.businessAccountId"
                  :readonly="!isEditing"
                  placeholder="WABA ID / Business Account ID"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Meta App ID <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.appId"
                  :readonly="!isEditing"
                  placeholder="App ID"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >System User ID <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.systemUserId"
                  :readonly="!isEditing"
                  placeholder="System User ID"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Status <span class="text-danger">*</span></label>
                <div>
                  <span
                    :class="{
                      'badge bg-success': whatsappData.status === 'connected',
                      'badge bg-danger': whatsappData.status === 'disconnected',
                    }"
                  >
                    <i
                      class="bi bi-circle-fill me-1"
                      style="font-size: 0.5rem"
                    ></i>
                    {{ whatsappData.status.toUpperCase() }}
                  </span>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Access Token <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input
                    :type="showToken ? 'text' : 'password'"
                    class="form-control font-monospace"
                    v-model="form.accessToken"
                    :readonly="!isEditing"
                    placeholder="EAAB..."
                  />
                  <button
                    class="btn btn-outline-secondary"
                    @click="showToken = !showToken"
                    type="button"
                  >
                    <i :class="showToken ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Webhook Verify Token <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control font-monospace"
                  v-model="form.webhookVerifyToken"
                  :readonly="!isEditing"
                  placeholder="verify_token_here"
                />
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Webhook Callback URL <span class="text-danger">*</span></label>
                <input
                  type="url"
                  class="form-control"
                  v-model="form.webhookCallbackUrl"
                  :readonly="!isEditing"
                  placeholder="https://api.example.com/webhook/whatsapp"
                />
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Last Webhook Event <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  :value="whatsappData.lastWebhookEventTime || 'No events yet'"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 fw-bold">Actions</h5>
          </div>
          <div class="card-body">
            <button class="btn btn-outline-primary w-100 mb-2" :disabled="isEditing">
              <i class="bi bi-arrow-repeat me-2"></i>Reconnect
            </button>
            <button class="btn btn-outline-danger w-100" :disabled="isEditing">
              <i class="bi bi-x-circle me-2"></i>Disable Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";
import type { WhatsAppIntegration } from "~/types";

const customerStore = useCustomerStore();
const route = useRoute();
const showToken = ref(false);
const isEditing = ref(false);
const saving = ref(false);

// Mock WhatsApp data - in real app would come from API
const whatsappData = ref<WhatsAppIntegration>({
  id: "wa-integration-1",
  customerId: route.params.id as string,
  name: "Meta Cloud API",
  whatsappNumber: "+6281234567890",
  phoneNumberId: "123456789012345",
  businessAccountId: "BA-987654321",
  metaBusinessId: "102938475610293",
  accessToken: "EAABsC...XYZ123",
  webhookVerifyToken: "my_webhook_verify_token_12345",
  status: "connected",
  lastWebhookEventTime: "2024-02-13 20:45:30",
});

type WhatsAppConfigForm = {
  whatsappNumber: string;
  businessAccountId: string;
  metaBusinessId: string;
  appId: string;
  systemUserId: string;
  accessToken: string;
  webhookVerifyToken: string;
  webhookCallbackUrl: string;
};

const form = reactive<WhatsAppConfigForm>({
  whatsappNumber: whatsappData.value.whatsappNumber,
  businessAccountId: whatsappData.value.businessAccountId,
  metaBusinessId: whatsappData.value.metaBusinessId || "",
  appId: "123456789012345",
  systemUserId: "998877665544332",
  accessToken: whatsappData.value.accessToken,
  webhookVerifyToken: whatsappData.value.webhookVerifyToken,
  webhookCallbackUrl: "https://api.acme.com/webhook/whatsapp",
});

const originalForm = ref<WhatsAppConfigForm>({ ...form });

function cancelEdit() {
  Object.assign(form, originalForm.value);
  isEditing.value = false;
}

async function saveChanges() {
  if (!isEditing.value || saving.value) {
    return;
  }

  saving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 350));
    whatsappData.value.whatsappNumber = form.whatsappNumber;
    whatsappData.value.businessAccountId = form.businessAccountId;
    whatsappData.value.metaBusinessId = form.metaBusinessId;
    whatsappData.value.accessToken = form.accessToken;
    whatsappData.value.webhookVerifyToken = form.webhookVerifyToken;
    originalForm.value = { ...form };
    isEditing.value = false;
  } finally {
    saving.value = false;
  }
}

useHead({
  title: "WhatsApp Integration - AI Admin",
});

onMounted(() => {
  if (!customerStore.currentCustomer) {
    customerStore.fetchCustomerById(route.params.id as string);
  }
});
</script>
