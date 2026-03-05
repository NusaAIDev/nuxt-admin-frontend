<template>
  <div>
    <div class="mb-4">
      <h4 class="fw-bold mb-1">AI Settings</h4>
      <p class="text-secondary small mb-0">Manage AI behavior and monthly token limits.</p>
    </div>

    <div v-if="loading" class="card border-0 shadow-sm p-4 mb-4">
      <div class="d-flex align-items-center text-secondary small">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Loading AI settings...
      </div>
    </div>

    <div v-else class="card border-0 shadow-sm p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h6 class="fw-bold mb-0 text-uppercase small text-muted">AI Configuration</h6>
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
            <button class="btn btn-outline-primary" type="button" @click="isEditing = true">
              <i class="bi bi-pencil-square me-1"></i> Edit
            </button>
          </template>
          <template v-else>
            <button class="btn btn-primary px-4" type="button" @click="saveChanges" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Save Changes
            </button>
            <button class="btn btn-light border" type="button" @click="cancelEdit" :disabled="saving">Cancel</button>
          </template>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">AI ENABLED</label>
          <div class="form-check form-switch pt-1">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="aiEnabledSwitch"
              v-model="form.ai_enabled"
              :disabled="!isEditing"
            />
            <label class="form-check-label small text-secondary" for="aiEnabledSwitch">
              {{ form.ai_enabled ? "Enabled" : "Disabled" }}
            </label>
          </div>
        </div>

        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">AI MODE</label>
          <select class="form-select" v-model="form.ai_mode" :disabled="!isEditing">
            <option value="AUTO">AUTO</option>
            <option value="MANUAL">MANUAL</option>
            <option value="HYBRID">HYBRID</option>
          </select>
        </div>

        <div class="col-12">
          <label class="form-label text-secondary fw-semibold extra-small">SYSTEM PROMPT</label>
          <textarea
            class="form-control"
            rows="5"
            v-model="form.system_prompt"
            :readonly="!isEditing"
            placeholder="Define assistant behavior for this organization..."
          ></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">MONTHLY TOKEN LIMIT</label>
          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="form.monthly_token_limit"
            :readonly="!isEditing"
            placeholder="e.g. 1000000"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">MONTHLY TOKEN USED</label>
          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="form.monthly_token_used"
            :readonly="!isEditing"
            placeholder="e.g. 245000"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label text-secondary fw-semibold extra-small">TOKEN CYCLE END AT</label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="form.token_cycle_end_at"
            :readonly="!isEditing"
          />
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger border-0 py-2 px-3 mt-4 small">
      {{ errorMessage }}
    </div>

    <div v-if="showSuccessToast" class="toast-container position-fixed top-0 end-0 p-4" style="z-index: 1080">
      <div class="toast show text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true">
        <div class="d-flex align-items-center">
          <div class="toast-body py-2">
            AI settings updated successfully.
          </div>
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
const saving = ref(false);
const isEditing = ref(false);
const errorMessage = ref("");
const showSuccessToast = ref(false);
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

const form = reactive({
  ai_enabled: true,
  ai_mode: "AUTO",
  system_prompt: "",
  monthly_token_limit: 0,
  monthly_token_used: 0,
  token_cycle_end_at: "",
});

const originalForm = ref({ ...form });

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

function showToast() {
  showSuccessToast.value = true;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    showSuccessToast.value = false;
  }, 2500);
}

async function loadAiSettings() {
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
    if (!current) throw new Error("Organization not found");

    form.ai_enabled = (current as any).aiEnabled ?? true;
    form.ai_mode = (current as any).aiMode ?? "AUTO";
    form.system_prompt = current.systemInstruction || "";
    form.monthly_token_limit = Number((current as any).monthlyTokenLimit ?? 0);
    form.monthly_token_used = Number((current as any).monthlyTokenUsed ?? 0);
    form.token_cycle_end_at = toDateTimeLocal((current as any).tokenCycleEndAt || "");
    originalForm.value = { ...form };
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Failed to load AI settings.";
  } finally {
    loading.value = false;
  }
}

function cancelEdit() {
  Object.assign(form, originalForm.value);
  isEditing.value = false;
}

async function saveChanges() {
  if (saving.value || !isEditing.value) return;

  saving.value = true;
  errorMessage.value = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (customerStore.currentCustomer?.id === organizationId.value) {
      Object.assign(customerStore.currentCustomer, {
        aiEnabled: form.ai_enabled,
        aiMode: form.ai_mode,
        systemInstruction: form.system_prompt,
        monthlyTokenLimit: form.monthly_token_limit,
        monthlyTokenUsed: form.monthly_token_used,
        tokenCycleEndAt: fromDateTimeLocal(form.token_cycle_end_at),
      } as any);
    }

    originalForm.value = { ...form };
    isEditing.value = false;
    showToast();
  } catch (err: any) {
    errorMessage.value = err?.data?.message || "Failed to save AI settings.";
  } finally {
    saving.value = false;
  }
}

watch(
  () => organizationId.value,
  (id) => {
    if (!id) return;
    loadAiSettings();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (toastTimeout) clearTimeout(toastTimeout);
});

useHead({
  title: "AI Settings - AI Admin",
});
</script>

<style scoped>
.extra-small {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}
</style>
