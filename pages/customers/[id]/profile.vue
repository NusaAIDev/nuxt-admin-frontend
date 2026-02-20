<template>
  <div v-if="customer">
    <div class="row g-4">
      <div class="col-md-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white py-3 border-bottom">
            <h5 class="mb-0 fw-bold">Profile Information</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium small">Business Name</label>
                <input type="text" class="form-control" :value="customer.businessName" readonly>
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium small">Email Address</label>
                <input type="email" class="form-control" :value="customer.email" readonly>
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary fw-medium small">Industry</label>
                <input type="text" class="form-control" :value="customer.industry || 'Not set'" readonly>
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary fw-medium small">Country</label>
                <input type="text" class="form-control" :value="customer.country || 'Not set'" readonly>
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary fw-medium small">Timezone</label>
                <input type="text" class="form-control" :value="customer.timezone || 'Not set'" readonly>
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium small">System Instruction (AI Prompt)</label>
                <textarea class="form-control" rows="4" :value="customer.systemInstruction" readonly></textarea>
              </div>
            </div>
          </div>
          <div class="card-footer bg-light border-0 py-3">
            <button class="btn btn-sm btn-outline-primary">Edit Profile</button>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow-sm border-0 bg-light-subtle">
          <div class="card-body">
            <h6 class="fw-bold mb-3">Workspace Summary</h6>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-secondary small">Connected Since</span>
              <span class="small fw-medium">{{ customer.createdDate }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-secondary small">WhatsApp Status</span>
              <span :class="['badge', customer.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
                {{ customer.status.toUpperCase() }}
              </span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-secondary small">Integrations</span>
              <span class="small fw-medium">{{ customer.integrations?.length || 0 }}</span>
            </div>
            <hr>
            <div class="small text-muted">
              These settings define the foundation of the customer's workspace. Industry and region info help in tuning high-level AI responses.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();
const customer = computed(() => customerStore.currentCustomer);

useHead({
  title: 'Customer Profile - AI Admin'
});
</script>
