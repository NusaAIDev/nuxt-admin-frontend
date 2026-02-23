<template>
  <div v-if="customer">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">Customer</h4>
        <p class="text-secondary small mb-0">
          Customer contact details for this organization
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
          <button
            class="btn btn-success text-white px-4"
            @click="saveChanges"
            :disabled="saving"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-1"
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
        ? "Editing aktif. Perubahan akan disimpan saat klik Save Changes."
        : "Read-only mode. Klik Edit untuk mengubah data customer." }}
    </div>

    <div class="card border-0 shadow-sm p-4">
      <div class="row g-4">
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">FULL NAME</label>
          <input
            type="text"
            class="form-control"
            v-model="form.name"
            :readonly="!isEditing"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">JOB ROLE</label>
          <input
            type="text"
            class="form-control"
            v-model="form.role"
            :readonly="!isEditing"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">EMAIL ADDRESS</label>
          <input
            type="email"
            class="form-control"
            v-model="form.email"
            :readonly="!isEditing"
          />
        </div>
        <div class="col-12">
          <label class="form-label text-secondary fw-semibold extra-small">ADDRESS</label>
          <input
            type="text"
            class="form-control"
            v-model="form.address"
            :readonly="!isEditing"
          />
        </div>
        <div class="col-12">
          <label class="form-label text-secondary fw-semibold extra-small">INTERNAL NOTES</label>
          <textarea
            class="form-control"
            rows="4"
            v-model="form.notes"
            :readonly="!isEditing"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm p-4 mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="fw-bold mb-1">Generate New Password</h6>
          <p class="text-secondary small mb-0">
            Generate password baru untuk akses customer portal.
          </p>
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
          <label class="form-label text-secondary fw-semibold extra-small">NEW PASSWORD</label>
          <input
            type="text"
            class="form-control font-monospace"
            :value="generatedPassword"
            readonly
            placeholder="Click Generate to create password"
          />
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button
            class="btn btn-light border w-100"
            :disabled="!generatedPassword"
            @click="copyPassword"
          >
            <i class="bi bi-clipboard me-1"></i> Copy
          </button>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-3">
        <button
          class="btn btn-primary"
          :disabled="!hasUnsavedPassword || savingPassword"
          @click="saveGeneratedPassword"
        >
          <span v-if="savingPassword" class="spinner-border spinner-border-sm me-1"></span>
          Save Password
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";

definePageMeta({
  alias: ["/organization/:id/profile", "/customers/:id/profile"],
});

const customerStore = useCustomerStore();
const customer = computed(() => customerStore.currentCustomer);

const isEditing = ref(false);
const saving = ref(false);
const generatedPassword = ref("");
const savedPassword = ref("");
const savingPassword = ref(false);
const hasUnsavedPassword = computed(
  () => Boolean(generatedPassword.value) && generatedPassword.value !== savedPassword.value,
);

const form = reactive({
  name: "",
  role: "",
  email: "",
  address: "",
  notes: "",
});

function initForm() {
  if (!customer.value) return;

  Object.assign(form, {
    name: customer.value.name || "",
    role: customer.value.role || "",
    email: customer.value.email || "",
    address: customer.value.address || "",
    notes: customer.value.notes || "",
  });
}

watch(
  customer,
  () => {
    initForm();
  },
  { immediate: true },
);

function cancelEdit() {
  isEditing.value = false;
  initForm();
}

async function saveChanges() {
  if (!customer.value) return;
  saving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 700));
    Object.assign(customer.value, { ...form });
    isEditing.value = false;
  } finally {
    saving.value = false;
  }
}

function generatePassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  generatedPassword.value = Array.from({ length: 14 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
}

async function copyPassword() {
  if (!generatedPassword.value || !navigator?.clipboard) {
    return;
  }
  await navigator.clipboard.writeText(generatedPassword.value);
}

async function saveGeneratedPassword() {
  if (!hasUnsavedPassword.value || savingPassword.value) {
    return;
  }
  savingPassword.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    savedPassword.value = generatedPassword.value;
  } finally {
    savingPassword.value = false;
  }
}

useHead({
  title: `${customer.value?.name || "Customer"} - AI Admin`,
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
