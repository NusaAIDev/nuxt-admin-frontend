<template>
  <div class="container py-4">
    <div class="mb-4">
      <NuxtLink to="/organization" class="btn btn-link text-decoration-none p-0 text-secondary mb-2">
        <i class="bi bi-arrow-left me-1"></i> Back to Organizations
      </NuxtLink>
      <h3 class="fw-bold mb-1">Create Organization</h3>
      <p class="text-secondary">Create organization data for workspace onboarding.</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
          <h5 class="fw-bold mb-0"><i class="bi bi-building me-2"></i>Organization Information</h5>
        </div>
        <div class="card-body px-4 pb-4">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label fw-medium">Company Name <span class="text-danger">*</span></label>
              <input type="text" v-model="form.companyName" class="form-control" placeholder="e.g. Acme Corporation Ltd" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Website</label>
              <input type="text" v-model="form.website" class="form-control" placeholder="e.g. https://acme.com">
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Industry <span class="text-danger">*</span></label>
              <input type="text" v-model="form.industry" class="form-control" placeholder="e.g. Technology" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Category <span class="text-danger">*</span></label>
              <select v-model="form.category" class="form-select" required>
                <option value="" disabled>Select category</option>
                <option value="Retail">Retail</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Services">Services</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Phone Number <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text">+62</span>
                <input
                  type="tel"
                  v-model="form.organizationPhoneNumber"
                  class="form-control"
                  placeholder="81234567890"
                  required
                >
              </div>
            </div>
            <div class="col-12">
              <label class="form-label fw-medium">Address <span class="text-danger">*</span></label>
              <textarea
                v-model="form.organizationAddress"
                class="form-control"
                rows="3"
                placeholder="Street, City, Province"
                required
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
          <h5 class="fw-bold mb-0"><i class="bi bi-person me-2"></i>Customer Information</h5>
        </div>
        <div class="card-body px-4 pb-4">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label fw-medium">Name <span class="text-danger">*</span></label>
              <input type="text" v-model="form.name" class="form-control" placeholder="e.g. John Doe" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Email <span class="text-danger">*</span></label>
              <input type="email" v-model="form.email" class="form-control" placeholder="john@example.com" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Gender <span class="text-danger">*</span></label>
              <select v-model="form.gender" class="form-select" required>
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Phone Number <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text">+62</span>
                <input
                  type="tel"
                  v-model="form.customerPhoneNumber"
                  class="form-control"
                  placeholder="81234567890"
                  required
                >
              </div>
            </div>
            <div class="col-12">
              <label class="form-label fw-medium">Address <span class="text-danger">*</span></label>
              <textarea
                v-model="form.customerAddress"
                class="form-control"
                rows="3"
                placeholder="Street, City, Province"
                required
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-2">
        <button type="submit" class="btn btn-primary px-5 shadow-sm" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Save
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
  companyName: '',
  website: '',
  industry: '',
  organizationAddress: '',
  category: '',
  organizationPhoneNumber: '',
  name: '',
  email: '',
  gender: '',
  customerPhoneNumber: '',
  customerAddress: '',
});

function normalizePhoneNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  const withoutLeadingZero = digitsOnly.replace(/^0+/, '');
  return `+62${withoutLeadingZero}`;
}

async function handleSubmit() {
  loading.value = true;
  try {
    const organizationPhoneNumber = normalizePhoneNumber(form.organizationPhoneNumber);
    const customerPhoneNumber = normalizePhoneNumber(form.customerPhoneNumber);

    const newCustomerData = {
      ...form,
      phone: customerPhoneNumber,
      businessName: form.companyName,
      whatsappNumber: organizationPhoneNumber,
      website: form.website,
      metaBusinessId: '',
      businessCategory: form.category,
      systemInstruction: 'You are a helpful customer support assistant for this business. Be polite, professional, and informative.',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      industry: form.industry,
      role: form.gender,
      address: form.customerAddress,
      businessAddress: form.organizationAddress,
      gender: form.gender,
      primaryContact: {
        id: `contact_${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: customerPhoneNumber,
        role: form.gender,
        gender: form.gender,
        address: form.customerAddress,
        notes: '',
      },
      status: 'active' as const,
      aiModeDefault: true,
      messagesThisMonth: 0,
      createdDate: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.companyName)}&background=random&color=fff`,
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
  title: 'Create Organization - AI Admin'
});
</script>
