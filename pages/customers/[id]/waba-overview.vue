<template>
  <div v-if="customer">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">WABA Overview</h4>
        <p class="text-secondary small mb-0">
          Business onboarding profile, verification documents, status, and WABA identifiers
        </p>
      </div>
      <div class="d-flex gap-2">
        <span
          :class="[
            'badge px-3 py-2 fw-semibold d-flex align-items-center',
            isEditing ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary',
          ]"
        >
          {{ isEditing ? "EDIT MODE" : "VIEW MODE" }}
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

    <div
      class="alert border-0 py-2 px-3 mb-4 small"
      :class="isEditing ? 'alert-warning' : 'alert-secondary'"
    >
      {{ isEditing
        ? "Editing aktif. Perubahan belum tersimpan sampai klik Save Changes."
        : "Read-only mode. Klik Edit untuk mengubah data WABA." }}
    </div>

    <div class="row g-4" :class="isEditing ? 'edit-mode' : 'view-mode'">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm p-4 mb-4">
          <h6 class="fw-bold mb-3 text-uppercase small text-muted">WABA Business Profile</h6>
          <p class="text-secondary small mb-4">
            Data utama yang dibutuhkan saat pendaftaran WhatsApp Business Account.
          </p>

          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">COMPANY / PT NAME</label>
              <input
                type="text"
                class="form-control"
                v-model="form.legalEntityName"
                :readonly="!isEditing"
                placeholder="PT Example Indonesia"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">WABA DISPLAY NAME</label>
              <input
                type="text"
                class="form-control"
                v-model="form.displayName"
                :readonly="!isEditing"
                placeholder="Brand name shown to users"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">WHATSAPP NUMBER</label>
              <input
                type="text"
                class="form-control"
                v-model="form.whatsappNumber"
                :readonly="!isEditing"
                placeholder="+628xxxxxxxxxx"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">BUSINESS CATEGORY</label>
              <select class="form-select" v-model="form.businessCategory" :disabled="!isEditing">
                <option value="">Select category</option>
                <option value="Retail">Retail</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Services">Services</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">WEBSITE URL</label>
              <input
                type="url"
                class="form-control"
                v-model="form.website"
                :readonly="!isEditing"
                placeholder="https://company.com"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">BUSINESS EMAIL</label>
              <input
                type="email"
                class="form-control"
                v-model="form.businessEmail"
                :readonly="!isEditing"
                placeholder="support@company.com"
              />
            </div>
            <div class="col-12">
              <label class="form-label text-secondary fw-semibold extra-small">BUSINESS ADDRESS</label>
              <input
                type="text"
                class="form-control"
                v-model="form.businessAddress"
                :readonly="!isEditing"
                placeholder="Alamat legal usaha"
              />
            </div>
            <div class="col-12">
              <label class="form-label text-secondary fw-semibold extra-small">BUSINESS DESCRIPTION</label>
              <textarea
                class="form-control"
                rows="3"
                v-model="form.businessDescription"
                :readonly="!isEditing"
                placeholder="Deskripsi bisnis yang akan digunakan pada profil WhatsApp"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm p-4 mb-4">
          <h6 class="fw-bold mb-3 text-uppercase small text-muted">Verification Documents</h6>
          <p class="text-secondary small mb-4">
            Upload berkas legal untuk proses verifikasi bisnis Meta Cloud API.
          </p>

          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">NPWP NUMBER</label>
              <input
                type="text"
                class="form-control"
                v-model="form.npwpNumber"
                :readonly="!isEditing"
                placeholder="contoh: 01.234.567.8-901.000"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">COMPANY PROOF DOCUMENT</label>
              <input
                type="file"
                class="form-control"
                :disabled="!isEditing"
                @change="handleDocumentUpload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <div class="col-12">
              <label class="form-label text-secondary fw-semibold extra-small">UPLOADED FILE</label>
              <input
                type="text"
                class="form-control"
                :value="form.companyProofFileName || 'No file uploaded'"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm p-4 mb-4">
          <h6 class="fw-bold mb-4 text-uppercase small text-muted">WABA Status</h6>
          <div class="d-flex align-items-center mb-4">
            <div class="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
              <i class="bi bi-chat-dots-fill text-primary fs-4"></i>
            </div>
            <div>
              <div class="small text-muted mb-0">WABA Registration</div>
              <div class="h5 fw-bold mb-0 text-dark">{{ form.registrationStatus || "PENDING" }}</div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">Verification</span>
              <span :class="['badge rounded-pill', customer.status === 'active' ? 'bg-success' : 'bg-danger']">
                {{ form.verificationStatus || "PENDING" }}
              </span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">Display Name Status</span>
              <span
                :class="[
                  'badge rounded-pill',
                  form.displayNameStatus === 'APPROVED' ? 'bg-success' : 'bg-warning text-dark',
                ]"
              >
                {{ form.displayNameStatus || "PENDING_REVIEW" }}
              </span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">Quality Rating</span>
              <span class="fw-bold small text-dark">{{ form.qualityRating || "N/A" }}</span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">Messaging Tier</span>
              <span class="fw-bold small text-dark">{{ form.messagingTier || "N/A" }}</span>
            </div>
            <div class="d-flex justify-content-between py-2">
              <span class="text-secondary small">Created At</span>
              <span class="fw-medium small text-dark">{{ formatDate(customer.createdDate) }}</span>
            </div>
          </div>

        </div>

        <div class="card border-0 shadow-sm bg-danger bg-opacity-10 p-4">
          <h6 class="fw-bold text-danger mb-2 small text-uppercase">Danger Zone</h6>
          <p class="text-danger small opacity-75 mb-3">
            Suspending the workspace will immediately stop all AI responses and webhook processing.
          </p>
          <button class="btn btn-danger btn-sm text-white px-3 w-100">
            <i class="bi bi-slash-circle me-1"></i> Suspend Workspace
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";

definePageMeta({
  alias: ["/organization/:id/workspace"],
});

const customerStore = useCustomerStore();
const customer = computed(() => customerStore.currentCustomer);

const isEditing = ref(false);
const saving = ref(false);

const form = reactive({
  legalEntityName: "",
  displayName: "",
  businessCategory: "",
  whatsappNumber: "",
  website: "",
  businessEmail: "",
  businessAddress: "",
  businessDescription: "",
  metaBusinessId: "",
  businessAccountId: "",
  phoneNumberId: "",
  npwpNumber: "",
  companyProofFileName: "",
  registrationStatus: "PENDING",
  verificationStatus: "PENDING",
  displayNameStatus: "PENDING_REVIEW",
  qualityRating: "N/A",
  messagingTier: "TIER_1",
});

function initForm() {
  if (!customer.value) return;

  const integration = customer.value.integrations?.[0];

  Object.assign(form, {
    legalEntityName: customer.value.businessName || "",
    displayName: integration?.name || customer.value.name || customer.value.businessName || "",
    businessCategory: customer.value.businessCategory || integration?.businessCategory || "",
    whatsappNumber: customer.value.whatsappNumber || integration?.whatsappNumber || "",
    website: customer.value.website || "",
    businessEmail: customer.value.email || "",
    businessAddress: (customer.value as any).businessAddress || "",
    businessDescription: (customer.value as any).businessDescription || "",
    metaBusinessId: customer.value.metaBusinessId || integration?.metaBusinessId || "",
    businessAccountId: integration?.businessAccountId || "",
    phoneNumberId: integration?.phoneNumberId || "",
    npwpNumber: (customer.value as any).npwpNumber || "",
    companyProofFileName: (customer.value as any).companyProofFileName || "",
    registrationStatus: (customer.value as any).registrationStatus || "PENDING",
    verificationStatus: (customer.value as any).verificationStatus || "PENDING",
    displayNameStatus: (customer.value as any).displayNameStatus || "PENDING_REVIEW",
    qualityRating: (customer.value as any).qualityRating || "N/A",
    messagingTier: (customer.value as any).messagingTier || "TIER_1",
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
    await new Promise((resolve) => setTimeout(resolve, 800));

    const primaryIntegration = customer.value.integrations?.[0]
      ? { ...customer.value.integrations[0] }
      : {
          id: `waba_${customer.value.id}`,
          customerId: customer.value.id,
          name: form.displayName || "Primary WABA",
          whatsappNumber: form.whatsappNumber,
          phoneNumberId: "",
          businessAccountId: "",
          accessToken: "",
          webhookVerifyToken: "",
          status: "connected" as const,
          lastWebhookEventTime: null,
        };

    Object.assign(primaryIntegration, {
      name: form.displayName,
      whatsappNumber: form.whatsappNumber,
      phoneNumberId: form.phoneNumberId,
      businessAccountId: form.businessAccountId,
      metaBusinessId: form.metaBusinessId,
      businessCategory: form.businessCategory,
    });

    Object.assign(customer.value, {
      businessName: form.legalEntityName,
      name: form.displayName,
      businessCategory: form.businessCategory,
      whatsappNumber: form.whatsappNumber,
      website: form.website,
      metaBusinessId: form.metaBusinessId,
      email: form.businessEmail,
      businessAddress: form.businessAddress,
      businessDescription: form.businessDescription,
      npwpNumber: form.npwpNumber,
      companyProofFileName: form.companyProofFileName,
      registrationStatus: form.registrationStatus,
      verificationStatus: form.verificationStatus,
      displayNameStatus: form.displayNameStatus,
      qualityRating: form.qualityRating,
      messagingTier: form.messagingTier,
      integrations: [primaryIntegration],
    } as any);

    isEditing.value = false;
  } catch (err) {
    console.error("Failed to save changes:", err);
  } finally {
    saving.value = false;
  }
}

function handleDocumentUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  form.companyProofFileName = file?.name || "";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

useHead({
  title: `${customer.value?.businessName || "Workspace"} Overview - AI Admin`,
});
</script>

<style scoped>
.extra-small {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.view-mode .form-control:read-only,
.view-mode .form-select:disabled {
  background-color: #f8fafc;
  border-color: transparent;
  box-shadow: none;
}

.edit-mode .form-control,
.edit-mode .form-select {
  background-color: #fff;
  border-color: #c7d2fe;
}

.edit-mode .card {
  border: 1px solid #e2e8f0 !important;
}
</style>
