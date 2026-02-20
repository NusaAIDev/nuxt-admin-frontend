<template>
  <div v-if="customer">
    <div class="row g-4">
      <div class="col-md-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white py-3 border-bottom">
            <h5 class="mb-0 fw-bold">Customer Personal Information</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium small">Full Name</label>
                <input type="text" class="form-control" v-model="form.name" :readonly="!isEditing">
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium small">Job Role/Title</label>
                <input type="text" class="form-control" v-model="form.role" :readonly="!isEditing">
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium small">Email Address</label>
                <input type="email" class="form-control" v-model="form.email" :readonly="!isEditing">
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium small">Phone Number</label>
                <input type="text" class="form-control" v-model="form.phone" :readonly="!isEditing">
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium small">Address</label>
                <input type="text" class="form-control" v-model="form.address" :readonly="!isEditing">
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary fw-medium small">Industry</label>
                <select v-if="isEditing" class="form-select" v-model="form.industry">
                   <option value="Retail">Retail</option>
                   <option value="Technology">Technology</option>
                   <option value="Healthcare">Healthcare</option>
                   <option value="Real Estate">Real Estate</option>
                   <option value="Education">Education</option>
                </select>
                <input v-else type="text" class="form-control" :value="customer.industry || 'Not set'" readonly>
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary fw-medium small">Country</label>
                <input type="text" class="form-control" v-model="form.country" :readonly="!isEditing">
              </div>
              <div class="col-md-4">
                <label class="form-label text-secondary fw-medium small">Timezone</label>
                <input type="text" class="form-control" v-model="form.timezone" :readonly="!isEditing">
              </div>

              <div class="col-12">
                <label class="form-label text-secondary fw-medium small">Internal Notes</label>
                <textarea v-if="isEditing" class="form-control" rows="4" v-model="form.notes"></textarea>
                <div v-else class="p-3 bg-light rounded small">{{ customer.notes || 'No notes' }}</div>
              </div>
            </div>
          </div>
          <div class="card-footer bg-light border-0 py-3">
            <template v-if="!isEditing">
              <button class="btn btn-sm btn-outline-primary" @click="isEditing = true">
                <i class="bi bi-pencil me-1"></i>Edit Profile
              </button>
            </template>
            <template v-else>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary" @click="saveChanges" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                  Save Changes
                </button>
                <button class="btn btn-sm btn-light border" @click="cancelEdit" :disabled="saving">Cancel</button>
              </div>
            </template>
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

const isEditing = ref(false);
const saving = ref(false);

const form = reactive({
  name: '',
  role: '',
  email: '',
  phone: '',
  address: '',
  industry: '',
  country: '',
  timezone: '',
  notes: ''
});

function initForm() {
  if (customer.value) {
    Object.assign(form, {
      name: customer.value.name || '',
      role: customer.value.role || '',
      email: customer.value.email || '',
      phone: customer.value.phone || '',
      address: customer.value.address || '',
      industry: customer.value.industry || '',
      country: customer.value.country || '',
      timezone: customer.value.timezone || '',
      notes: customer.value.notes || ''
    });
  }
}

watch(customer, () => {
  initForm();
}, { immediate: true });

function cancelEdit() {
  isEditing.value = false;
  initForm();
}

async function saveChanges() {
  if (!customer.value) return;
  
  saving.value = true;
  try {
    // In a real app, this would call a service method
    // For simulation, we just update the store's currentCustomer if it was mutable,
    // but usually it's better to dispatch an action.
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local store state (simulated)
    Object.assign(customer.value, { ...form });
    
    isEditing.value = false;
  } catch (err) {
    console.error('Failed to save changes:', err);
  } finally {
    saving.value = false;
  }
}

useHead({
  title: `${customer.value?.name || 'Customer'} Profile - AI Admin`
});
</script>
