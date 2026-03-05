<template>
  <div>
    <div class="mb-4">
      <h4 class="fw-bold mb-1">Organization Account</h4>
      <p class="text-secondary small mb-0">Manage organization information.</p>
    </div>

    <div v-if="loading" class="card border-0 shadow-sm p-4 mb-4">
      <div class="d-flex align-items-center text-secondary small">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Loading organization data...
      </div>
    </div>

    <div v-else>
      <div class="card border-0 shadow-sm p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h6 class="fw-bold mb-0 text-uppercase small text-muted">Organization Information</h6>
          <div class="d-flex gap-2">
            <span
              :class="[
                'badge px-3 py-2 fw-semibold d-flex align-items-center',
                isEditingOrganization ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary',
              ]"
            >
              {{ isEditingOrganization ? "EDIT MODE" : "VIEW MODE" }}
            </span>
            <template v-if="!isEditingOrganization">
              <button class="btn btn-outline-primary" type="button" @click="isEditingOrganization = true">
                <i class="bi bi-pencil-square me-1"></i> Edit
              </button>
            </template>
            <template v-else>
              <button class="btn btn-primary px-4" type="button" @click="saveOrganizationInfo" :disabled="savingOrganization">
                <span v-if="savingOrganization" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Save Changes
              </button>
              <button class="btn btn-light border" type="button" @click="cancelOrganizationEdit" :disabled="savingOrganization">
                Cancel
              </button>
            </template>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">COMPANY NAME <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              v-model="organizationForm.company_name"
              :readonly="!isEditingOrganization"
              placeholder="PT Example Indonesia"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">WEBSITE</label>
            <input
              type="text"
              class="form-control"
              v-model="organizationForm.website"
              :readonly="!isEditingOrganization"
              placeholder="https://company.com"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">INDUSTRY <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              v-model="organizationForm.industry"
              :readonly="!isEditingOrganization"
              placeholder="Technology"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">CATEGORY <span class="text-danger">*</span></label>
            <select class="form-select" v-model="organizationForm.category" :disabled="!isEditingOrganization" required>
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
            <label class="form-label text-secondary fw-semibold extra-small">PHONE NUMBER <span class="text-danger">*</span></label>
            <div class="input-group">
              <span class="input-group-text">+62</span>
              <input
                type="tel"
                class="form-control"
                v-model="organizationForm.phone_number"
                :readonly="!isEditingOrganization"
                placeholder="81234567890"
                required
              />
            </div>
          </div>
          <div class="col-12">
            <label class="form-label text-secondary fw-semibold extra-small">ADDRESS <span class="text-danger">*</span></label>
            <textarea
              class="form-control"
              rows="3"
              v-model="organizationForm.address"
              :readonly="!isEditingOrganization"
              placeholder="Street, City, Province"
              required
            ></textarea>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h6 class="fw-bold mb-0 text-uppercase small text-muted">Legalities</h6>
          <div class="d-flex gap-2">
            <span
              :class="[
                'badge px-3 py-2 fw-semibold d-flex align-items-center',
                isEditingLegalities ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary',
              ]"
            >
              {{ isEditingLegalities ? "EDIT MODE" : "VIEW MODE" }}
            </span>
            <template v-if="!isEditingLegalities">
              <button class="btn btn-outline-primary" type="button" @click="isEditingLegalities = true">
                <i class="bi bi-pencil-square me-1"></i> Edit
              </button>
            </template>
            <template v-else>
              <button class="btn btn-primary px-4" type="button" @click="saveLegalities" :disabled="savingLegalities">
                <span v-if="savingLegalities" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Save Changes
              </button>
              <button class="btn btn-light border" type="button" @click="cancelLegalitiesEdit" :disabled="savingLegalities">
                Cancel
              </button>
            </template>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">META BUSINESS ID</label>
            <input type="text" class="form-control" v-model="legalitiesForm.meta_business_id" :readonly="!isEditingLegalities" />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">META BUSINESS STATUS</label>
            <select class="form-select" v-model="legalitiesForm.meta_business_status" :disabled="!isEditingLegalities">
              <option value="NOT_CREATED">NOT_CREATED</option>
              <option value="PENDING">PENDING</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">LEGAL NAME</label>
            <input type="text" class="form-control" v-model="legalitiesForm.legal_name" :readonly="!isEditingLegalities" />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">NPWP NUMBER</label>
            <input type="text" class="form-control" v-model="legalitiesForm.npwp_number" :readonly="!isEditingLegalities" />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">DOCUMENT PROOF</label>
            <input
              type="file"
              class="form-control"
              :disabled="!isEditingLegalities"
              @change="handleDocumentProofUpload"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <div v-if="legalitiesForm.document_proof" class="form-text small mt-2">
              Current file: {{ legalitiesForm.document_proof }}
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">META BUSINESS VERIFIED AT</label>
            <input
              type="datetime-local"
              class="form-control"
              v-model="legalitiesForm.meta_business_verified_at"
              :readonly="!isEditingLegalities"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger border-0 py-2 px-3 mt-4 small">
      {{ errorMessage }}
    </div>

    <div v-if="showSuccessToast" class="toast-container position-fixed top-0 end-0 p-4" style="z-index: 1080">
      <div class="toast show text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true">
        <div class="d-flex align-items-center">
          <div class="toast-body py-2">{{ toastMessage }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            @click="showSuccessToast = false"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";

const route = useRoute();
const customerStore = useCustomerStore();
const organizationId = computed(() => route.params.id as string);

const loading = ref(true);
const savingOrganization = ref(false);
const savingLegalities = ref(false);
const isEditingOrganization = ref(false);
const isEditingLegalities = ref(false);
const errorMessage = ref("");
const showSuccessToast = ref(false);
const toastMessage = ref("Saved successfully.");
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

const organizationForm = reactive({
  company_name: "",
  website: "",
  industry: "",
  category: "",
  phone_number: "",
  address: "",
});
const originalOrganizationForm = ref({ ...organizationForm });

const legalitiesForm = reactive({
  meta_business_id: "",
  meta_business_status: "NOT_CREATED",
  legal_name: "",
  npwp_number: "",
  document_proof: "",
  meta_business_verified_at: "",
});
const originalLegalitiesForm = ref({ ...legalitiesForm });

function toLocalPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits.slice(2);
  if (digits.startsWith("0")) return digits.replace(/^0+/, "");
  return digits;
}

function toApiPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("62")
    ? digits.slice(2)
    : digits.replace(/^0+/, "");
  return normalized ? `+62${normalized}` : "";
}

function showToast(message: string) {
  toastMessage.value = message;
  showSuccessToast.value = true;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    showSuccessToast.value = false;
  }, 2500);
}

async function loadOrganization() {
  loading.value = true;
  errorMessage.value = "";

  try {
    if (
      !customerStore.currentCustomer ||
      customerStore.currentCustomer.id !== organizationId.value
    ) {
      await customerStore.fetchCustomerById(organizationId.value);
    }

    const current = customerStore.currentCustomer;
    if (!current) {
      throw new Error("Organization not found");
    }

    organizationForm.company_name = current.businessName || "";
    organizationForm.website = current.website || "";
    organizationForm.industry = current.industry || "";
    organizationForm.category = current.businessCategory || "";
    organizationForm.phone_number = toLocalPhone(current.whatsappNumber || current.phone || "");
    organizationForm.address = (current as any).businessAddress || current.address || "";
    originalOrganizationForm.value = { ...organizationForm };

    legalitiesForm.meta_business_id = (current as any).metaBusinessId || "";
    legalitiesForm.meta_business_status = (current as any).metaBusinessStatus || "NOT_CREATED";
    legalitiesForm.legal_name = (current as any).legalName || current.businessName || "";
    legalitiesForm.npwp_number = (current as any).npwpNumber || "";
    legalitiesForm.document_proof = (current as any).documentProof || "";
    legalitiesForm.meta_business_verified_at = toDateTimeLocal((current as any).metaBusinessVerifiedAt || "");
    originalLegalitiesForm.value = { ...legalitiesForm };
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Failed to load organization data.";
  } finally {
    loading.value = false;
  }
}

function toDateTimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromDateTimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function cancelOrganizationEdit() {
  Object.assign(organizationForm, originalOrganizationForm.value);
  isEditingOrganization.value = false;
}

function cancelLegalitiesEdit() {
  Object.assign(legalitiesForm, originalLegalitiesForm.value);
  isEditingLegalities.value = false;
}

function handleDocumentProofUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  legalitiesForm.document_proof = file?.name || legalitiesForm.document_proof;
}

async function saveOrganizationInfo() {
  if (savingOrganization.value || !isEditingOrganization.value) return;

  savingOrganization.value = true;
  errorMessage.value = "";

  try {
    const normalizedPhone = toApiPhone(organizationForm.phone_number);
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (customerStore.currentCustomer?.id === organizationId.value) {
      Object.assign(customerStore.currentCustomer, {
        businessName: organizationForm.company_name,
        website: organizationForm.website,
        industry: organizationForm.industry,
        businessCategory: organizationForm.category,
        whatsappNumber: normalizedPhone,
        phone: normalizedPhone,
        businessAddress: organizationForm.address,
        address: organizationForm.address,
      } as any);
    }

    organizationForm.phone_number = toLocalPhone(normalizedPhone);
    originalOrganizationForm.value = { ...organizationForm };
    isEditingOrganization.value = false;

    showToast("Organization information updated successfully.");
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Failed to save organization information.";
  } finally {
    savingOrganization.value = false;
  }
}

async function saveLegalities() {
  if (savingLegalities.value || !isEditingLegalities.value) return;

  savingLegalities.value = true;
  errorMessage.value = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (customerStore.currentCustomer?.id === organizationId.value) {
      Object.assign(customerStore.currentCustomer, {
        metaBusinessId: legalitiesForm.meta_business_id,
        metaBusinessStatus: legalitiesForm.meta_business_status,
        legalName: legalitiesForm.legal_name,
        npwpNumber: legalitiesForm.npwp_number,
        documentProof: legalitiesForm.document_proof,
        metaBusinessVerifiedAt: fromDateTimeLocal(legalitiesForm.meta_business_verified_at),
      } as any);
    }

    originalLegalitiesForm.value = { ...legalitiesForm };
    isEditingLegalities.value = false;

    showToast("Legalities information updated successfully.");
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Failed to save legalities information.";
  } finally {
    savingLegalities.value = false;
  }
}

watch(
  () => organizationId.value,
  (id) => {
    if (!id) return;
    loadOrganization();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (toastTimeout) clearTimeout(toastTimeout);
});

useHead({
  title: "Organization Account - AI Admin",
});
</script>

<style scoped>
.extra-small {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}
</style>
