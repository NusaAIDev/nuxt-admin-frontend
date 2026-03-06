<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">WhatsApp Integration</h4>
        <p class="text-secondary small mb-0">
          Monitor connection status and API details
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
          <button class="btn btn-primary" @click="saveChanges" :disabled="saving">
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
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
        ? "Editing aktif. Status koneksi tetap otomatis dari Meta Cloud API."
        : "Read-only mode. Klik Edit untuk mengubah konfigurasi API." }}
    </div>

    <div v-if="actionNotice" class="alert alert-success py-2 px-3 small border-0 mb-4">
      {{ actionNotice }}
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 fw-bold">Connection Details</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >WhatsApp Number <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-whatsapp text-success"></i
                  ></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.whatsappNumber"
                    :readonly="!isEditing"
                    placeholder="+6281234567890"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium"
                  >Status <span class="text-danger">*</span></label>
                <div>
                  <span
                    :class="{
                      'badge bg-success': whatsappData.status === 'connected',
                      'badge bg-danger': whatsappData.status === 'disconnected',
                    }"
                  >
                    <i
                      class="bi bi-circle-fill me-1"
                      style="font-size: 0.5rem"
                    ></i>
                    {{ whatsappData.status.toUpperCase() }}
                  </span>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Access Token <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input
                    :type="showToken ? 'text' : 'password'"
                    class="form-control font-monospace"
                    v-model="form.accessToken"
                    :readonly="!isEditing"
                    placeholder="EAAB..."
                  />
                  <button
                    class="btn btn-outline-secondary"
                    @click="showToken = !showToken"
                    type="button"
                  >
                    <i :class="showToken ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Webhook Verify Token <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input
                    :type="showWebhookVerifyToken ? 'text' : 'password'"
                    class="form-control font-monospace"
                    v-model="form.webhookVerifyToken"
                    :readonly="!isEditing"
                    placeholder="verify_token_here"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    @click="showWebhookVerifyToken = !showWebhookVerifyToken"
                    type="button"
                  >
                    <i :class="showWebhookVerifyToken ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label text-secondary fw-medium"
                  >Webhook Callback URL <span class="text-danger">*</span></label>
                <input
                  type="url"
                  class="form-control"
                  v-model="form.webhookCallbackUrl"
                  :readonly="!isEditing"
                  placeholder="https://api.example.com/webhook/whatsapp"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium">Last Webhook Event</label>
                <input
                  type="text"
                  class="form-control"
                  :value="formatDateTime(webhookHealth.lastWebhookReceivedAt)"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label text-secondary fw-medium">Webhook Subscription</label>
                <input
                  type="text"
                  class="form-control"
                  :value="webhookHealth.subscriptionStatus"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
            <h5 class="mb-0 fw-bold">Token &amp; Permission Health</h5>
            <button
              class="btn btn-outline-primary btn-sm"
              type="button"
              @click="runTokenHealthCheck"
              :disabled="checkingToken"
            >
              <span
                v-if="checkingToken"
                class="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              Run Health Check
            </button>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="small text-secondary">Token Status</div>
              <span class="badge rounded-pill" :class="tokenStatusClass">{{ tokenStatusLabel }}</span>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <div class="small text-secondary mb-1">Expires At</div>
                <div class="fw-semibold">{{ formatDateTime(tokenHealth.expiresAt) }}</div>
              </div>
              <div class="col-md-4">
                <div class="small text-secondary mb-1">Days Left</div>
                <div class="fw-semibold">{{ tokenDaysLeftText }}</div>
              </div>
              <div class="col-md-4">
                <div class="small text-secondary mb-1">Last Checked</div>
                <div class="fw-semibold">{{ formatDateTime(tokenHealth.lastCheckedAt) }}</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="small text-secondary mb-2">Granted Scopes</div>
              <div class="d-flex flex-wrap gap-2">
                <span
                  v-for="scope in tokenHealth.grantedScopes"
                  :key="scope"
                  class="badge rounded-pill text-bg-success-subtle text-success-emphasis"
                >
                  {{ scope }}
                </span>
              </div>
            </div>

            <div>
              <div class="small text-secondary mb-2">Missing Scopes</div>
              <div v-if="tokenHealth.missingScopes.length > 0" class="d-flex flex-wrap gap-2">
                <span
                  v-for="scope in tokenHealth.missingScopes"
                  :key="scope"
                  class="badge rounded-pill text-bg-danger-subtle text-danger-emphasis"
                >
                  {{ scope }}
                </span>
              </div>
              <div v-else class="small text-success">All required scopes are granted.</div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
            <h5 class="mb-0 fw-bold">API Error Logs (Actionable Retry)</h5>
            <div class="d-flex align-items-center gap-2">
              <span class="badge text-bg-light border">{{ openErrorCount }} open</span>
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="retryAllFailed"
                :disabled="retryingAll || retryableOpenErrorCount === 0"
              >
                <span
                  v-if="retryingAll"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Retry All
              </button>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-secondary small text-uppercase">
                    <th class="ps-3">Time</th>
                    <th>Endpoint</th>
                    <th>Error</th>
                    <th>Status</th>
                    <th class="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in apiErrorLogs" :key="log.id">
                    <td class="small ps-3">{{ formatDateTime(log.requestTime) }}</td>
                    <td>
                      <div class="fw-semibold small">{{ log.endpoint }}</div>
                      <div class="text-secondary extra-small">Code: {{ log.errorCode }}</div>
                    </td>
                    <td class="small text-secondary" style="max-width: 280px">{{ log.errorMessage }}</td>
                    <td>
                      <span class="badge rounded-pill" :class="logStatusClass(log.finalStatus)">
                        {{ log.finalStatus }}
                      </span>
                      <div class="extra-small text-secondary mt-1">Retry: {{ log.retryCount }}</div>
                    </td>
                    <td class="text-end pe-3">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        type="button"
                        @click="retryLog(log.id)"
                        :disabled="!isRetryable(log) || isRetrying(log.id)"
                      >
                        <span
                          v-if="isRetrying(log.id)"
                          class="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Retry
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
            <h5 class="mb-0 fw-bold">Webhook Health</h5>
            <span class="badge rounded-pill" :class="webhookStateClass">{{ webhookState }}</span>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between py-2 border-bottom">
              <span class="text-secondary small">Subscription</span>
              <span
                class="badge"
                :class="webhookHealth.subscriptionStatus === 'SUBSCRIBED' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
              >
                {{ webhookHealth.subscriptionStatus }}
              </span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom">
              <span class="text-secondary small">Last Event</span>
              <span class="small fw-medium">{{ formatDateTime(webhookHealth.lastWebhookReceivedAt) }}</span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom">
              <span class="text-secondary small">Minutes Since Last Event</span>
              <span class="small fw-medium">{{ webhookMinutesSinceLastEventText }}</span>
            </div>
            <div class="d-flex justify-content-between py-2 border-bottom">
              <span class="text-secondary small">Failed Deliveries</span>
              <span class="small fw-medium">{{ webhookHealth.failedWebhookCount }}</span>
            </div>
            <div class="d-flex justify-content-between py-2">
              <span class="text-secondary small">Last Status Sync</span>
              <span class="small fw-medium">{{ formatDateTime(webhookHealth.lastStatusSyncAt) }}</span>
            </div>

            <div v-if="webhookHealth.lastWebhookError" class="alert alert-danger py-2 px-3 small mt-3 mb-0">
              {{ webhookHealth.lastWebhookError }}
            </div>

            <div class="d-grid gap-2 mt-3">
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="refreshWebhookHealth"
                :disabled="checkingWebhook"
              >
                <span
                  v-if="checkingWebhook"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Refresh Webhook Status
              </button>
              <button
                class="btn btn-outline-danger"
                type="button"
                @click="retryFailedWebhooks"
                :disabled="checkingWebhook || webhookHealth.failedWebhookCount === 0"
              >
                Retry Failed Deliveries
              </button>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 fw-bold">Actions</h5>
          </div>
          <div class="card-body">
            <button class="btn btn-outline-primary w-100 mb-2" :disabled="isEditing">
              <i class="bi bi-arrow-repeat me-2"></i>Reconnect
            </button>
            <button class="btn btn-outline-danger w-100" :disabled="isEditing">
              <i class="bi bi-x-circle me-2"></i>Disable Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";
import type { WhatsAppIntegration } from "~/types";

type SubscriptionStatus = "SUBSCRIBED" | "NOT_SUBSCRIBED";
type ApiErrorCode = number | "TIMEOUT";
type ApiLogStatus = "OPEN" | "RECOVERED" | "BLOCKED";

type WhatsAppConfigForm = {
  whatsappNumber: string;
  accessToken: string;
  webhookVerifyToken: string;
  webhookCallbackUrl: string;
};

type ApiErrorLog = {
  id: string;
  requestTime: string;
  endpoint: string;
  errorCode: ApiErrorCode;
  errorMessage: string;
  retryCount: number;
  lastRetryAt: string | null;
  finalStatus: ApiLogStatus;
};

const REQUIRED_SCOPES = [
  "whatsapp_business_messaging",
  "whatsapp_business_management",
  "business_management",
];
const RETRYABLE_CODES: ApiErrorCode[] = [429, 500, 502, 503, 504, "TIMEOUT"];

const customerStore = useCustomerStore();
const route = useRoute();
const showToken = ref(false);
const showWebhookVerifyToken = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const checkingWebhook = ref(false);
const checkingToken = ref(false);
const retryingAll = ref(false);
const retryingLogs = ref<Record<string, boolean>>({});
const actionNotice = ref("");
let noticeTimeout: ReturnType<typeof setTimeout> | null = null;

const whatsappData = ref<WhatsAppIntegration>({
  id: "wa-integration-1",
  customerId: route.params.id as string,
  name: "Meta Cloud API",
  whatsappNumber: "+6281234567890",
  phoneNumberId: "123456789012345",
  businessAccountId: "BA-987654321",
  metaBusinessId: "102938475610293",
  accessToken: "EAABsC...XYZ123",
  webhookVerifyToken: "my_webhook_verify_token_12345",
  status: "connected",
  lastWebhookEventTime: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
});

const form = reactive<WhatsAppConfigForm>({
  whatsappNumber: whatsappData.value.whatsappNumber,
  accessToken: whatsappData.value.accessToken,
  webhookVerifyToken: whatsappData.value.webhookVerifyToken,
  webhookCallbackUrl: "https://api.acme.com/webhook/whatsapp",
});

const originalForm = ref<WhatsAppConfigForm>({ ...form });

const tokenHealth = reactive({
  expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  lastCheckedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  grantedScopes: ["whatsapp_business_messaging", "business_management"],
  missingScopes: ["whatsapp_business_management"],
});

const webhookHealth = reactive({
  subscriptionStatus: "SUBSCRIBED" as SubscriptionStatus,
  lastWebhookReceivedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  failedWebhookCount: 2,
  lastWebhookError: "POST /webhook/messages timeout after 10s",
  lastStatusSyncAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
});

const apiErrorLogs = ref<ApiErrorLog[]>([
  {
    id: "api_err_1",
    requestTime: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    endpoint: "POST /messages",
    errorCode: 429,
    errorMessage: "Rate limit exceeded while sending outbound message.",
    retryCount: 1,
    lastRetryAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    finalStatus: "OPEN",
  },
  {
    id: "api_err_2",
    requestTime: new Date(Date.now() - 26 * 60 * 1000).toISOString(),
    endpoint: "GET /subscribed_apps",
    errorCode: 403,
    errorMessage: "Missing whatsapp_business_management permission.",
    retryCount: 0,
    lastRetryAt: null,
    finalStatus: "BLOCKED",
  },
  {
    id: "api_err_3",
    requestTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    endpoint: "POST /webhook/messages",
    errorCode: "TIMEOUT",
    errorMessage: "Webhook delivery timed out before acknowledgment.",
    retryCount: 2,
    lastRetryAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    finalStatus: "OPEN",
  },
]);

const tokenDaysLeft = computed<number | null>(() => {
  const expiresMs = Date.parse(tokenHealth.expiresAt);
  if (Number.isNaN(expiresMs)) {
    return null;
  }
  return Math.ceil((expiresMs - Date.now()) / (24 * 60 * 60 * 1000));
});

const tokenStatus = computed<"VALID" | "EXPIRING_SOON" | "EXPIRED" | "UNKNOWN">(() => {
  if (tokenDaysLeft.value === null) {
    return "UNKNOWN";
  }
  if (tokenDaysLeft.value <= 0) {
    return "EXPIRED";
  }
  if (tokenDaysLeft.value <= 3) {
    return "EXPIRING_SOON";
  }
  return "VALID";
});

const tokenStatusLabel = computed(() => {
  if (tokenStatus.value === "EXPIRING_SOON") {
    return "EXPIRING SOON";
  }
  return tokenStatus.value;
});

const tokenStatusClass = computed(() => {
  if (tokenStatus.value === "VALID") {
    return "bg-success-subtle text-success-emphasis";
  }
  if (tokenStatus.value === "EXPIRING_SOON") {
    return "bg-warning-subtle text-warning-emphasis";
  }
  if (tokenStatus.value === "EXPIRED") {
    return "bg-danger-subtle text-danger-emphasis";
  }
  return "bg-secondary-subtle text-secondary";
});

const tokenDaysLeftText = computed(() => {
  if (tokenDaysLeft.value === null) {
    return "-";
  }
  if (tokenDaysLeft.value <= 0) {
    return "Expired";
  }
  return `${tokenDaysLeft.value} day(s)`;
});

const webhookMinutesSinceLastEvent = computed<number | null>(() => {
  const eventMs = Date.parse(webhookHealth.lastWebhookReceivedAt);
  if (Number.isNaN(eventMs)) {
    return null;
  }
  return Math.max(0, Math.floor((Date.now() - eventMs) / (60 * 1000)));
});

const webhookMinutesSinceLastEventText = computed(() => {
  if (webhookMinutesSinceLastEvent.value === null) {
    return "-";
  }
  return `${webhookMinutesSinceLastEvent.value} min`;
});

const isWebhookStale = computed(() => {
  if (webhookHealth.subscriptionStatus !== "SUBSCRIBED") {
    return true;
  }
  if (webhookMinutesSinceLastEvent.value === null) {
    return true;
  }
  return webhookMinutesSinceLastEvent.value > 15;
});

const webhookState = computed<"HEALTHY" | "DEGRADED" | "CRITICAL">(() => {
  if (webhookHealth.subscriptionStatus !== "SUBSCRIBED") {
    return "CRITICAL";
  }
  if (isWebhookStale.value || webhookHealth.failedWebhookCount > 0) {
    return "DEGRADED";
  }
  return "HEALTHY";
});

const webhookStateClass = computed(() => {
  if (webhookState.value === "HEALTHY") {
    return "bg-success-subtle text-success-emphasis";
  }
  if (webhookState.value === "DEGRADED") {
    return "bg-warning-subtle text-warning-emphasis";
  }
  return "bg-danger-subtle text-danger-emphasis";
});

const openErrorCount = computed(
  () => apiErrorLogs.value.filter((log) => log.finalStatus === "OPEN").length,
);

const retryableOpenErrorCount = computed(
  () => apiErrorLogs.value.filter((log) => isRetryable(log)).length,
);

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
}

function logStatusClass(status: ApiLogStatus) {
  if (status === "OPEN") {
    return "bg-danger-subtle text-danger-emphasis";
  }
  if (status === "RECOVERED") {
    return "bg-success-subtle text-success-emphasis";
  }
  return "bg-warning-subtle text-warning-emphasis";
}

function showNotice(message: string) {
  actionNotice.value = message;
  if (noticeTimeout) {
    clearTimeout(noticeTimeout);
  }
  noticeTimeout = setTimeout(() => {
    actionNotice.value = "";
  }, 3000);
}

function isRetryable(log: ApiErrorLog) {
  return log.finalStatus === "OPEN" && RETRYABLE_CODES.includes(log.errorCode);
}

function isRetrying(logId: string) {
  return Boolean(retryingLogs.value[logId]);
}

function hydrateFromCustomer() {
  const current = customerStore.currentCustomer as any;
  if (!current) {
    return;
  }

  const integration = current.integrations?.[0] as WhatsAppIntegration | undefined;
  if (integration) {
    whatsappData.value = {
      ...whatsappData.value,
      ...integration,
      customerId: current.id,
    };

    form.whatsappNumber = integration.whatsappNumber || form.whatsappNumber;
    form.accessToken = integration.accessToken || form.accessToken;
    form.webhookVerifyToken = integration.webhookVerifyToken || form.webhookVerifyToken;

    if (integration.lastWebhookEventTime) {
      webhookHealth.lastWebhookReceivedAt = integration.lastWebhookEventTime;
    }
  }

  webhookHealth.subscriptionStatus = current.webhookSubscriptionStatus || webhookHealth.subscriptionStatus;
  webhookHealth.failedWebhookCount = Number(current.failedWebhookCount ?? webhookHealth.failedWebhookCount);
  webhookHealth.lastWebhookError = current.lastWebhookError || webhookHealth.lastWebhookError;

  tokenHealth.expiresAt = current.accessTokenExpiresAt || tokenHealth.expiresAt;
  tokenHealth.grantedScopes = Array.isArray(current.grantedScopes)
    ? [...current.grantedScopes]
    : [...tokenHealth.grantedScopes];
  tokenHealth.missingScopes = REQUIRED_SCOPES.filter(
    (scope) => !tokenHealth.grantedScopes.includes(scope),
  );

  originalForm.value = { ...form };
}

function cancelEdit() {
  Object.assign(form, originalForm.value);
  isEditing.value = false;
}

async function runTokenHealthCheck() {
  if (checkingToken.value) {
    return;
  }

  checkingToken.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 550));
    tokenHealth.lastCheckedAt = new Date().toISOString();
    tokenHealth.missingScopes = REQUIRED_SCOPES.filter(
      (scope) => !tokenHealth.grantedScopes.includes(scope),
    );
    showNotice("Token and permission health check completed.");
  } finally {
    checkingToken.value = false;
  }
}

async function refreshWebhookHealth() {
  if (checkingWebhook.value) {
    return;
  }

  checkingWebhook.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 550));
    webhookHealth.lastStatusSyncAt = new Date().toISOString();

    if (webhookHealth.subscriptionStatus === "SUBSCRIBED") {
      webhookHealth.lastWebhookReceivedAt = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      if (webhookHealth.failedWebhookCount > 0) {
        webhookHealth.failedWebhookCount -= 1;
      }

      if (webhookHealth.failedWebhookCount === 0) {
        webhookHealth.lastWebhookError = "";
      }
    }

    showNotice("Webhook status refreshed.");
  } finally {
    checkingWebhook.value = false;
  }
}

async function retryFailedWebhooks() {
  if (checkingWebhook.value || webhookHealth.failedWebhookCount === 0) {
    return;
  }

  checkingWebhook.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const openWebhookLogs = apiErrorLogs.value.filter(
      (log) => log.finalStatus === "OPEN" && log.endpoint.includes("/webhook") && isRetryable(log),
    );

    for (const log of openWebhookLogs) {
      log.retryCount += 1;
      log.lastRetryAt = new Date().toISOString();
      log.finalStatus = "RECOVERED";
    }

    webhookHealth.failedWebhookCount = 0;
    webhookHealth.lastWebhookError = "";
    webhookHealth.lastStatusSyncAt = new Date().toISOString();
    webhookHealth.lastWebhookReceivedAt = new Date().toISOString();

    showNotice("Failed webhook deliveries retried successfully.");
  } finally {
    checkingWebhook.value = false;
  }
}

async function retryLog(logId: string) {
  const target = apiErrorLogs.value.find((log) => log.id === logId);
  if (!target || !isRetryable(target) || retryingLogs.value[logId]) {
    return;
  }

  retryingLogs.value = {
    ...retryingLogs.value,
    [logId]: true,
  };

  try {
    await new Promise((resolve) => setTimeout(resolve, 650));
    target.retryCount += 1;
    target.lastRetryAt = new Date().toISOString();
    target.finalStatus = "RECOVERED";

    if (target.endpoint.includes("/webhook") && webhookHealth.failedWebhookCount > 0) {
      webhookHealth.failedWebhookCount -= 1;
      if (webhookHealth.failedWebhookCount === 0) {
        webhookHealth.lastWebhookError = "";
      }
    }

    showNotice(`Retry succeeded for ${target.endpoint}.`);
  } finally {
    const next = { ...retryingLogs.value };
    delete next[logId];
    retryingLogs.value = next;
  }
}

async function retryAllFailed() {
  if (retryingAll.value || retryableOpenErrorCount.value === 0) {
    return;
  }

  retryingAll.value = true;
  try {
    const retryableLogs = apiErrorLogs.value.filter((log) => isRetryable(log));
    for (const log of retryableLogs) {
      await retryLog(log.id);
    }
    showNotice("Retry completed for all retryable errors.");
  } finally {
    retryingAll.value = false;
  }
}

async function saveChanges() {
  if (!isEditing.value || saving.value) {
    return;
  }

  saving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 350));
    whatsappData.value.whatsappNumber = form.whatsappNumber;
    whatsappData.value.accessToken = form.accessToken;
    whatsappData.value.webhookVerifyToken = form.webhookVerifyToken;
    whatsappData.value.lastWebhookEventTime = webhookHealth.lastWebhookReceivedAt;

    if (customerStore.currentCustomer) {
      const current = customerStore.currentCustomer as any;
      const integration = current.integrations?.[0]
        ? { ...current.integrations[0] }
        : {
            id: `wa_${current.id}`,
            customerId: current.id,
            name: "Meta Cloud API",
            whatsappNumber: form.whatsappNumber,
            phoneNumberId: "",
            businessAccountId: "",
            accessToken: form.accessToken,
            webhookVerifyToken: form.webhookVerifyToken,
            status: whatsappData.value.status,
            lastWebhookEventTime: webhookHealth.lastWebhookReceivedAt,
          };

      Object.assign(integration, {
        whatsappNumber: form.whatsappNumber,
        accessToken: form.accessToken,
        webhookVerifyToken: form.webhookVerifyToken,
        status: whatsappData.value.status,
        lastWebhookEventTime: webhookHealth.lastWebhookReceivedAt,
      });

      Object.assign(current, {
        whatsappNumber: form.whatsappNumber,
        integrations: [integration],
        webhookSubscriptionStatus: webhookHealth.subscriptionStatus,
        failedWebhookCount: webhookHealth.failedWebhookCount,
        lastWebhookError: webhookHealth.lastWebhookError,
        accessTokenExpiresAt: tokenHealth.expiresAt,
        grantedScopes: [...tokenHealth.grantedScopes],
      });
    }

    originalForm.value = { ...form };
    isEditing.value = false;
    showNotice("API configuration saved.");
  } finally {
    saving.value = false;
  }
}

useHead({
  title: "WhatsApp Integration - AI Admin",
});

onBeforeUnmount(() => {
  if (noticeTimeout) {
    clearTimeout(noticeTimeout);
  }
});

onMounted(async () => {
  if (
    !customerStore.currentCustomer ||
    customerStore.currentCustomer.id !== (route.params.id as string)
  ) {
    await customerStore.fetchCustomerById(route.params.id as string);
  }

  hydrateFromCustomer();
});
</script>
