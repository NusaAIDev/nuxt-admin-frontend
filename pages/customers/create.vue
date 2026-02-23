<template>
  <div class="container py-4">
    <div class="mb-4">
      <NuxtLink to="/organization" class="btn btn-link text-decoration-none p-0 text-secondary mb-2">
        <i class="bi bi-arrow-left me-1"></i> Back to Organizations
      </NuxtLink>
      <h3 class="fw-bold mb-1">Add New Organization</h3>
      <p class="text-secondary">Create organization workspace and primary customer contact details.</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="row">
        <!-- INTERNAL CONTACT PROFILE -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0"><i class="bi bi-person me-2"></i>Primary Admin Contact</h5>
              <p class="text-muted small mb-0">Internal contact details for the organization account.</p>
            </div>
            <div class="card-body px-4">
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
                <label class="form-label fw-medium">Phone Number</label>
                <input type="tel" v-model="form.phone" class="form-control" placeholder="+123456789">
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium">Address</label>
                <input type="text" v-model="form.address" class="form-control" placeholder="Street, City, State">
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Industry</label>
                  <select v-model="form.industry" class="form-select">
                    <option value="">Select Industry</option>
                    <option value="Retail">Retail</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Country</label>
                  <input type="text" v-model="form.country" class="form-control" placeholder="e.g. USA">
                </div>
              </div>
              <div class="mb-0">
                <label class="form-label fw-medium">Internal Notes</label>
                <textarea v-model="form.notes" class="form-control" rows="2" placeholder="Administrative notes about this client..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- META BUSINESS PROFILE (Meta Registration) -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm border-0 h-100 border-primary-subtle border-start border-4">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0 text-primary"><i class="bi bi-meta me-2"></i>Meta Business Details</h5>
              <p class="text-muted small mb-0">Official information registered on Meta Business Manager.</p>
            </div>
            <div class="card-body px-4">
              <div class="mb-3">
                <label class="form-label fw-medium text-primary">Registered Business Name <span class="text-danger">*</span></label>
                <input type="text" v-model="form.businessName" class="form-control border-primary-subtle" placeholder="As seen on Meta" required>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium text-primary">WhatsApp Number <span class="text-danger">*</span></label>
                  <input type="text" v-model="form.whatsappNumber" class="form-control border-primary-subtle" placeholder="+1..." required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium text-primary">Business Category</label>
                  <input type="text" v-model="form.businessCategory" class="form-control border-primary-subtle" placeholder="e.g. Shopping">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Meta Business ID</label>
                  <input type="text" v-model="form.metaBusinessId" class="form-control" placeholder="15-digit ID">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Website URL</label>
                  <input type="url" v-model="form.website" class="form-control" placeholder="https://...">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium">System Instructions</label>
                <textarea v-model="form.systemInstruction" class="form-control" rows="4" placeholder="How the AI should represent this business..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-3 mt-2">
        <NuxtLink to="/organization" class="btn btn-light px-4 border ms-auto">Cancel</NuxtLink>
        <button type="submit" class="btn btn-primary px-5 shadow-sm" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Create Organization
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
  name: '',
  email: '',
  phone: '',
  role: '',
  address: '',
  notes: '',
  industry: '',
  country: '',
  businessName: '',
  whatsappNumber: '',
  website: '',
  metaBusinessId: '',
  businessCategory: '',
  systemInstruction: 'You are a helpful customer support assistant for this business. Be polite, professional, and informative.',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});

async function handleSubmit() {
  loading.value = true;
  try {
    const newCustomerData = {
      ...form,
      primaryContact: {
        id: `contact_${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        address: form.address,
        notes: form.notes,
      },
      status: 'active' as const,
      aiModeDefault: true,
      messagesThisMonth: 0,
      createdDate: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random&color=fff`,
    };

    // Store action will return the created customer with ID
    const newCustomer = await customerStore.addCustomer(newCustomerData);
    
    // Redirect to workspace entry route
    if (newCustomer && newCustomer.id) {
        router.push(`/organization/${newCustomer.id}/workspace`);
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
  title: 'Add Organization - AI Admin'
});
</script>

<style scoped>
.border-primary-subtle {
  border-color: #dee2e6;
}
</style>
