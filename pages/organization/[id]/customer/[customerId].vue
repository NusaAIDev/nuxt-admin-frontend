<template>
  <div v-if="contact">
    <div class="mb-4">
      <NuxtLink :to="`/organization/${organizationId}/customer`" class="btn btn-link text-decoration-none p-0 text-secondary mb-2">
        <i class="bi bi-arrow-left me-1"></i> Back to Customer List
      </NuxtLink>
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 class="fw-bold mb-1">Customer Detail</h4>
          <p class="text-secondary small mb-0">Update customer information and manage portal password.</p>
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
            <button class="btn btn-success text-white px-4" @click="saveChanges" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              Save Changes
            </button>
            <button class="btn btn-light border" @click="cancelEdit" :disabled="saving">Cancel</button>
          </template>
        </div>
      </div>
    </div>

    <div class="alert py-2 mb-4" :class="isEditing ? 'alert-warning' : 'alert-secondary'">
      {{ isEditing
        ? "Editing aktif. Perubahan akan disimpan saat klik Save Changes."
        : "Read-only mode. Klik Edit untuk mengubah data customer." }}
    </div>

    <div class="card border-0 shadow-sm p-4">
      <div class="row g-4">
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">FULL NAME <span class="text-danger">*</span></label>
          <input type="text" class="form-control" v-model="form.fullName" :readonly="!isEditing" />
        </div>
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">JOB ROLE <span class="text-danger">*</span></label>
          <input type="text" class="form-control" v-model="form.jobRole" :readonly="!isEditing" />
        </div>
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">EMAIL ADDRESS <span class="text-danger">*</span></label>
          <input type="email" class="form-control" v-model="form.email" :readonly="!isEditing" />
        </div>
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">NO. WHATSAPP <span class="text-danger">*</span></label>
          <input type="text" class="form-control" v-model="form.whatsappNumber" :readonly="!isEditing" />
        </div>
        <div class="col-12">
          <label class="form-label text-secondary fw-semibold extra-small">ADDRESS <span class="text-danger">*</span></label>
          <input type="text" class="form-control" v-model="form.address" :readonly="!isEditing" />
        </div>
        <div class="col-12">
          <label class="form-label text-secondary fw-semibold extra-small">INTERNAL NOTES <span class="text-danger">*</span></label>
          <textarea class="form-control" rows="4" v-model="form.internalNotes" :readonly="!isEditing"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm p-4 mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="fw-bold mb-1">Generate New Password</h6>
          <p class="text-secondary small mb-0">Generate password baru untuk akses customer portal.</p>
        </div>
        <button class="btn btn-outline-primary" @click="generatePassword">
          <i class="bi bi-key me-1"></i> Generate
        </button>
      </div>

      <div class="alert py-2 mb-3" :class="hasUnsavedPassword ? 'alert-warning' : 'alert-secondary'">
        {{ hasUnsavedPassword
          ? "Password baru belum disimpan. Klik Save Password untuk konfirmasi perubahan."
          : "Belum ada perubahan password yang perlu disimpan." }}
      </div>

      <div class="row g-3">
        <div class="col-md-9">
          <label class="form-label text-secondary fw-semibold extra-small">NEW PASSWORD <span class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control font-monospace"
            :value="generatedPassword"
            readonly
            placeholder="Click Generate to create password"
          />
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-light border w-100" :disabled="!generatedPassword" @click="copyPassword">
            <i class="bi bi-clipboard me-1"></i> Copy
          </button>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-primary" :disabled="!hasUnsavedPassword || savingPassword" @click="saveGeneratedPassword">
          <span v-if="savingPassword" class="spinner-border spinner-border-sm me-1"></span>
          Save Password
        </button>
      </div>
    </div>
  </div>

  <div v-else class="alert alert-warning">Customer contact not found.</div>
</template>

<script setup lang="ts">
import { useWorkspaceCustomers } from "~/composables/useWorkspaceCustomers";
import { useCustomerStore } from "~/stores/customer";

definePageMeta({
  alias: ["/organization/:id/customer/:customerId"],
});

const route = useRoute();
const organizationId = route.params.id as string;
const customerId = route.params.customerId as string;
const workspaceCustomers = useWorkspaceCustomers(organizationId);
const customerStore = useCustomerStore();

const contact = computed(() => workspaceCustomers.findById(customerId));

const isEditing = ref(false);
const saving = ref(false);
const generatedPassword = ref("");
const savedPassword = ref("");
const savingPassword = ref(false);
const hasUnsavedPassword = computed(
  () => Boolean(generatedPassword.value) && generatedPassword.value !== savedPassword.value,
);

const form = reactive({
  fullName: "",
  jobRole: "",
  email: "",
  whatsappNumber: "",
  address: "",
  internalNotes: "",
});

watch(
  contact,
  (value) => {
    if (!value) return;
    Object.assign(form, {
      fullName: value.fullName || "",
      jobRole: value.jobRole || "",
      email: value.email || "",
      whatsappNumber: value.whatsappNumber || "",
      address: value.address || "",
      internalNotes: value.internalNotes || "",
    });
  },
  { immediate: true },
);

onMounted(async () => {
  if (!customerStore.currentCustomer) {
    await customerStore.fetchCustomerById(organizationId);
  }
  if (customerStore.currentCustomer) {
    workspaceCustomers.initializeFromPrimary({
      fullName: customerStore.currentCustomer.name || "",
      jobRole: customerStore.currentCustomer.role || "",
      email: customerStore.currentCustomer.email || "",
      whatsappNumber:
        customerStore.currentCustomer.whatsappNumber ||
        customerStore.currentCustomer.phone ||
        "",
      address: customerStore.currentCustomer.address || "",
      internalNotes: customerStore.currentCustomer.notes || "",
    });
  }
});

function cancelEdit() {
  if (!contact.value) return;
  isEditing.value = false;
  Object.assign(form, {
    fullName: contact.value.fullName || "",
    jobRole: contact.value.jobRole || "",
    email: contact.value.email || "",
    whatsappNumber: contact.value.whatsappNumber || "",
    address: contact.value.address || "",
    internalNotes: contact.value.internalNotes || "",
  });
}

async function saveChanges() {
  if (!contact.value) return;
  saving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    workspaceCustomers.updateContact(contact.value.id, {
      fullName: form.fullName,
      jobRole: form.jobRole,
      email: form.email,
      whatsappNumber: form.whatsappNumber,
      address: form.address,
      internalNotes: form.internalNotes,
    });
    isEditing.value = false;
  } finally {
    saving.value = false;
  }
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  generatedPassword.value = Array.from({ length: 14 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
}

async function copyPassword() {
  if (!generatedPassword.value || !navigator?.clipboard) return;
  await navigator.clipboard.writeText(generatedPassword.value);
}

async function saveGeneratedPassword() {
  if (!hasUnsavedPassword.value || savingPassword.value) return;
  savingPassword.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    savedPassword.value = generatedPassword.value;
  } finally {
    savingPassword.value = false;
  }
}

useHead({
  title: "Customer Detail - AI Admin",
});
</script>

<style scoped>
.extra-small {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.form-control:read-only {
  background-color: #f8fafc;
}
</style>
