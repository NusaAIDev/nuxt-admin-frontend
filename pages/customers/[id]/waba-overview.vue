<template>
  <div v-if="customer" class="h-100 d-flex flex-column">
    <!-- Header Section -->
    <div class="p-4 border-bottom bg-white">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h4 class="mb-1 fw-bold text-dark"><i class="bi bi-whatsapp me-2 text-success"></i>WABA Overview</h4>
                <p class="text-muted small mb-0">Official WhatsApp Business Account integration and AI behavior settings.</p>
            </div>
            <div class="d-flex gap-2">
                <template v-if="!isEditing">
                    <button class="btn btn-outline-primary" @click="isEditing = true">
                        <i class="bi bi-pencil-square me-1"></i> Edit Configuration
                    </button>
                </template>
                <template v-else>
                    <button class="btn btn-success text-white px-4" @click="saveChanges" :disabled="saving">
                        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                        Save Changes
                    </button>
                    <button class="btn btn-light border" @click="cancelEdit" :disabled="saving">Cancel</button>
                </template>
            </div>
        </div>
    </div>

    <!-- Main Scrollable Body -->
    <div class="flex-grow-1 overflow-auto p-4 bg-light-subtle">
        <div class="row g-4">
            <!-- Details Column -->
            <div class="col-lg-8">
                <div class="card border-0 shadow-none bg-white p-4">
                    <h6 class="fw-bold mb-4 text-uppercase small text-muted">Business Registration</h6>
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-semibold extra-small">REG. BUSINESS NAME</label>
                            <input type="text" class="form-control form-control-lg bg-light border-0" v-model="form.businessName" :readonly="!isEditing">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-semibold extra-small">WHATSAPP NUMBER</label>
                            <input type="text" class="form-control form-control-lg bg-light border-0" v-model="form.whatsappNumber" :readonly="!isEditing">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-semibold extra-small">CATEGORY</label>
                            <input type="text" class="form-control bg-light border-0" v-model="form.businessCategory" :readonly="!isEditing">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-secondary fw-semibold extra-small">META BUSINESS ID</label>
                            <input type="text" class="form-control bg-light border-0" v-model="form.metaBusinessId" :readonly="!isEditing">
                        </div>
                        <div class="col-12">
                            <label class="form-label text-secondary fw-semibold extra-small">WEBSITE URL</label>
                            <input type="url" class="form-control bg-light border-0" v-model="form.website" :readonly="!isEditing">
                        </div>
                    </div>

                    <h6 class="fw-bold mt-5 mb-4 text-uppercase small text-muted">AI System Prompt</h6>
                    <div class="col-12">
                        <textarea class="form-control bg-light border-0" rows="8" v-model="form.systemInstruction" :readonly="!isEditing" placeholder="Define persona, rules, and knowledge..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Stats Column -->
            <div class="col-lg-4">
                <div class="card border-0 shadow-none bg-white p-4 mb-4">
                    <h6 class="fw-bold mb-4 text-uppercase small text-muted">Workspace Insights</h6>
                    <div class="d-flex align-items-center mb-4">
                        <div class="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                            <i class="bi bi-chat-dots-fill text-primary fs-4"></i>
                        </div>
                        <div>
                            <div class="small text-muted mb-0">Monthly Messages</div>
                            <div class="h3 fw-bold mb-0 text-dark">{{ customer.messagesThisMonth.toLocaleString() }}</div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="d-flex justify-content-between py-2 border-bottom border-light">
                            <span class="text-secondary small">Integration</span>
                            <span :class="['badge rounded-pill', customer.status === 'active' ? 'bg-success' : 'bg-danger']">
                                {{ customer.status.toUpperCase() }}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom border-light">
                            <span class="text-secondary small">AI Logic</span>
                            <span class="fw-bold small text-dark">{{ customer.aiModeDefault ? 'Automated' : 'Manual' }}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2">
                            <span class="text-secondary small">Created At</span>
                            <span class="fw-medium small text-dark">{{ formatDate(customer.createdDate) }}</span>
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-none bg-danger bg-opacity-10 p-4">
                    <h6 class="fw-bold text-danger mb-2 small text-uppercase">Danger Zone</h6>
                    <p class="text-danger small opacity-75 mb-3">Suspending the workspace will immediately stop all AI responses and webhook processing.</p>
                    <button class="btn btn-danger btn-sm text-white px-3 w-100">
                        <i class="bi bi-slash-circle me-1"></i> Suspend Workspace
                    </button>
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
  businessName: '',
  whatsappNumber: '',
  businessCategory: '',
  metaBusinessId: '',
  website: '',
  systemInstruction: ''
});

function initForm() {
  if (customer.value) {
    Object.assign(form, {
      businessName: customer.value.businessName || '',
      whatsappNumber: customer.value.whatsappNumber || '',
      businessCategory: customer.value.businessCategory || '',
      metaBusinessId: customer.value.metaBusinessId || '',
      website: customer.value.website || '',
      systemInstruction: customer.value.systemInstruction || ''
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
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update store state (simulated)
    Object.assign(customer.value, { ...form });
    
    isEditing.value = false;
  } catch (err) {
    console.error('Failed to save changes:', err);
  } finally {
    saving.value = false;
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

useHead({
  title: `${customer.value?.businessName || 'Workspace'} Overview - AI Admin`
});
</script>

<style scoped>
.bg-light-subtle {
  background-color: #f8fafc;
}

.extra-small {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.form-control:read-only {
  background-color: transparent !important;
  opacity: 0.8;
}
</style>
