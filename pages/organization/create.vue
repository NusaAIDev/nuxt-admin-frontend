<template>
  <div class="container py-4">
    <div class="mb-4">
      <NuxtLink to="/organization" class="btn btn-link text-decoration-none p-0 text-secondary mb-2">
        <i class="bi bi-arrow-left me-1"></i> Back to Organizations
      </NuxtLink>
      <h3 class="fw-bold mb-1">Add New Customer</h3>
      <p class="text-secondary">Create customer contact data for organization workspace.</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0"><i class="bi bi-person me-2"></i>Customer Information</h5>
              <p class="text-muted small mb-0">Person in charge from customer side.</p>
            </div>
            <div class="card-body px-4">
              <div class="mb-3">
                <label class="form-label fw-medium">Organization Name <span class="text-danger">*</span></label>
                <input type="text" v-model="form.organizationName" class="form-control" placeholder="e.g. Acme Corporation Ltd" required>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Full Name <span class="text-danger">*</span></label>
                  <input type="text" v-model="form.name" class="form-control" placeholder="e.g. John Doe" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Job Role/Title</label>
                  <input type="text" v-model="form.role" class="form-control" placeholder="e.g. Operations Manager">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium">Email Address <span class="text-danger">*</span></label>
                <input type="email" v-model="form.email" class="form-control" placeholder="john@example.com" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium">WA Number <span class="text-danger">*</span></label>
                <input type="text" v-model="form.whatsappNumber" class="form-control" placeholder="+628123456789" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium">Address</label>
                <input type="text" v-model="form.address" class="form-control" placeholder="Street, City, State">
              </div>
              <div class="mb-0">
                <label class="form-label fw-medium">Internal Notes</label>
                <textarea v-model="form.notes" class="form-control" rows="2" placeholder="Administrative notes about this client..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-3 mt-2">
        <NuxtLink to="/organization" class="btn btn-light px-4 border ms-auto">Cancel</NuxtLink>
        <button type="submit" class="btn btn-primary px-5 shadow-sm" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Create Customer
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();
const router = useRouter();

const loading = ref(false);

const form = reactive({
  organizationName: '',
  name: '',
  email: '',
  whatsappNumber: '',
  role: '',
  address: '',
  notes: '',
});

async function handleSubmit() {
  loading.value = true;
  try {
    const newCustomerData = {
      ...form,
      phone: form.whatsappNumber,
      businessName: form.organizationName,
      whatsappNumber: form.whatsappNumber,
      website: '',
      metaBusinessId: '',
      businessCategory: '',
      systemInstruction: 'You are a helpful customer support assistant for this business. Be polite, professional, and informative.',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      primaryContact: {
        id: `contact_${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.whatsappNumber,
        role: form.role,
        address: form.address,
        notes: form.notes,
      },
      status: 'active' as const,
      aiModeDefault: true,
      messagesThisMonth: 0,
      createdDate: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.organizationName)}&background=random&color=fff`,
    };

    // Store action will return the created customer with ID
    const newCustomer = await customerStore.addCustomer(newCustomerData);
    
    // Redirect to workspace entry route
    if (newCustomer && newCustomer.id) {
        router.push(`/organization/${newCustomer.id}/wabas`);
    } else {
        router.push('/organization');
    }
  } catch (err) {
    console.error('Failed to create customer:', err);
  } finally {
    loading.value = false;
  }
}

useHead({
  title: 'Add Customer - AI Admin'
});
</script>
