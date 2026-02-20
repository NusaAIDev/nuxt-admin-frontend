<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">WhatsApp Integration</h4>
        <p class="text-secondary small mb-0">
          Monitor connection status and API details
        </p>
      </div>
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
                  >WhatsApp Number</label
                >
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-whatsapp text-success"></i
                  ></span>
                  <input
                    type="text"
                    class="form-control"
                    :value="whatsappData.whatsappNumber"
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Phone Number ID</label
                >
                <input
                  type="text"
                  class="form-control"
                  :value="whatsappData.phoneNumberId"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Business Account ID</label
                >
                <input
                  type="text"
                  class="form-control"
                  :value="whatsappData.businessAccountId"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Status</label
                >
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
                  >Access Token</label
                >
                <div class="input-group">
                  <input
                    :type="showToken ? 'text' : 'password'"
                    class="form-control font-monospace"
                    :value="whatsappData.accessToken"
                    readonly
                  />
                  <button
                    class="btn btn-outline-secondary"
                    @click="showToken = !showToken"
                  >
                    <i :class="showToken ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Webhook Verify Token</label
                >
                <input
                  type="text"
                  class="form-control font-monospace"
                  :value="whatsappData.webhookVerifyToken"
                  readonly
                />
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Last Webhook Event</label
                >
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
            <button class="btn btn-primary w-100 mb-2">
              <i class="bi bi-send me-2"></i>Test Send Message
            </button>
            <button class="btn btn-outline-primary w-100 mb-2">
              <i class="bi bi-arrow-repeat me-2"></i>Reconnect
            </button>
            <button class="btn btn-outline-danger w-100">
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

// Mock WhatsApp data - in real app would come from API
const whatsappData = ref<WhatsAppIntegration>({
  customerId: route.params.id as string,
  whatsappNumber: "+6281234567890",
  phoneNumberId: "123456789012345",
  businessAccountId: "BA-987654321",
  accessToken: "EAABsC...XYZ123",
  webhookVerifyToken: "my_webhook_verify_token_12345",
  status: "connected",
  lastWebhookEventTime: "2024-02-13 20:45:30",
});

useHead({
  title: "WhatsApp Integration - AI Admin",
});

onMounted(() => {
  if (!customerStore.currentCustomer) {
    customerStore.fetchCustomerById(route.params.id as string);
  }
});
</script>
