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
            Core WABA fields and status columns for this organization workspace.
          </p>

          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">DISPLAY NAME</label>
              <input
                type="text"
                class="form-control"
                v-model="form.display_name"
                :readonly="!isEditing"
                placeholder="Brand name shown to users"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">WABA ID</label>
              <input
                type="text"
                class="form-control"
                v-model="form.waba_id"
                :readonly="!isEditing"
                placeholder="WABA ID"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">PHONE NUMBER ID</label>
              <input
                type="text"
                class="form-control"
                v-model="form.phone_number_id"
                :readonly="!isEditing"
                placeholder="Phone Number ID"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">DISPLAY PHONE NUMBER</label>
              <input
                type="text"
                class="form-control"
                v-model="form.display_phone_number"
                :readonly="!isEditing"
                placeholder="+628xxxxxxxxxx"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">QUALITY RATING</label>
              <select class="form-select" v-model="form.quality_rating" :disabled="!isEditing">
                <option value="GREEN">GREEN</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">MESSAGING LIMIT TIER</label>
              <input
                type="text"
                class="form-control"
                v-model="form.messaging_limit_tier"
                :readonly="!isEditing"
                placeholder="TIER_1"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">CONNECTION STATUS</label>
              <select class="form-select" v-model="form.connection_status" :disabled="!isEditing">
                <option value="CONNECTED">CONNECTED</option>
                <option value="DISCONNECTED">DISCONNECTED</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">WABA STATUS</label>
              <input type="text" class="form-control" v-model="form.waba_status" :readonly="!isEditing" />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">DISPLAY NAME STATUS</label>
              <input type="text" class="form-control" v-model="form.display_name_status" :readonly="!isEditing" />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">PHONE STATUS</label>
              <input type="text" class="form-control" v-model="form.phone_status" :readonly="!isEditing" />
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary fw-semibold extra-small">MESSAGING STATUS</label>
              <input type="text" class="form-control" v-model="form.messaging_status" :readonly="!isEditing" />
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
              <div class="small text-muted mb-0">Connection Status</div>
              <div class="h5 fw-bold mb-0 text-dark">{{ form.connection_status || "CONNECTED" }}</div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">WABA Status</span>
              <span :class="['badge rounded-pill', customer.status === 'active' ? 'bg-success' : 'bg-danger']">
                {{ form.waba_status || "UNKNOWN" }}
              </span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">Display Name Status</span>
              <span
                :class="[
                  'badge rounded-pill',
                  form.display_name_status === 'APPROVED' ? 'bg-success' : 'bg-warning text-dark',
                ]"
              >
                {{ form.display_name_status || "PENDING_REVIEW" }}
              </span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">Phone Status</span>
              <span class="badge rounded-pill bg-secondary-subtle text-secondary">
                {{ form.phone_status || "UNKNOWN" }}
              </span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom border-light">
              <span class="text-secondary small">Messaging Status</span>
              <span class="badge rounded-pill bg-secondary-subtle text-secondary">
                {{ form.messaging_status || "UNKNOWN" }}
              </span>
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
          <button class="btn btn-danger btn-sm text-white px-3 w-100" @click="openSuspendModal">
            <i class="bi bi-slash-circle me-1"></i> Suspend Workspace
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSuspendModal" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <div class="modal-content-custom">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="fw-bold mb-0">Confirm Suspend Workspace</h6>
            <button type="button" class="btn-close shadow-none" @click="closeSuspendModal"></button>
          </div>
          <p class="text-secondary small mb-4">
            Are you sure you want to suspend this workspace? This will stop AI replies and webhook processing.
          </p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-light border" @click="closeSuspendModal" :disabled="suspending">Cancel</button>
            <button class="btn btn-danger" @click="confirmSuspendWorkspace" :disabled="suspending">
              <span v-if="suspending" class="spinner-border spinner-border-sm me-2"></span>
              Yes, Suspend
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";

definePageMeta({
  alias: ["/organization/:id/wabas", "/organization/:id/workspace"],
});

const customerStore = useCustomerStore();
const customer = computed(() => customerStore.currentCustomer);

const isEditing = ref(false);
const saving = ref(false);
const showSuspendModal = ref(false);
const suspending = ref(false);

const form = reactive({
  display_name: "",
  waba_id: "",
  phone_number_id: "",
  display_phone_number: "",
  quality_rating: "",
  messaging_limit_tier: "",
  connection_status: "CONNECTED",
  waba_status: "",
  display_name_status: "",
  phone_status: "",
  messaging_status: "",
});

function initForm() {
  if (!customer.value) return;

  const integration = customer.value.integrations?.[0];

  Object.assign(form, {
    display_name: integration?.name || customer.value.name || customer.value.businessName || "",
    waba_id: integration?.businessAccountId || "",
    phone_number_id: integration?.phoneNumberId || "",
    display_phone_number: integration?.whatsappNumber || customer.value.whatsappNumber || "",
    quality_rating: (customer.value as any).qualityRating || "GREEN",
    messaging_limit_tier: (customer.value as any).messagingTier || "",
    connection_status: (integration?.status || "connected").toUpperCase(),
    waba_status: (customer.value as any).wabaStatus || "",
    display_name_status: (customer.value as any).displayNameStatus || "",
    phone_status: (customer.value as any).phoneStatus || "",
    messaging_status: (customer.value as any).messagingStatus || "",
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
          name: form.display_name || "Primary WABA",
          whatsappNumber: form.display_phone_number,
          phoneNumberId: "",
          businessAccountId: "",
          accessToken: "",
          webhookVerifyToken: "",
          status: "connected" as const,
          lastWebhookEventTime: null,
        };

    Object.assign(primaryIntegration, {
      name: form.display_name,
      whatsappNumber: form.display_phone_number,
      phoneNumberId: form.phone_number_id,
      businessAccountId: form.waba_id,
      status: form.connection_status.toLowerCase() === "disconnected" ? "disconnected" : "connected",
    });

    Object.assign(customer.value, {
      name: form.display_name,
      whatsappNumber: form.display_phone_number,
      displayNameStatus: form.display_name_status,
      qualityRating: form.quality_rating,
      messagingTier: form.messaging_limit_tier,
      wabaStatus: form.waba_status,
      phoneStatus: form.phone_status,
      messagingStatus: form.messaging_status,
      integrations: [primaryIntegration],
    } as any);

    isEditing.value = false;
  } catch (err) {
    console.error("Failed to save changes:", err);
  } finally {
    saving.value = false;
  }
}

function openSuspendModal() {
  showSuspendModal.value = true;
}

function closeSuspendModal() {
  if (suspending.value) return;
  showSuspendModal.value = false;
}

async function confirmSuspendWorkspace() {
  if (!customer.value || suspending.value) return;

  suspending.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    customer.value.status = "suspended";
    showSuspendModal.value = false;
  } finally {
    suspending.value = false;
  }
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

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 460px;
}

.modal-content-custom {
  background: #fff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.18);
}
</style>
