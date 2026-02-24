<template>
  <div
    id="sidebar-wrapper"
    class="border-end bg-white"
    style="
      height: 100vh;
      position: sticky;
      top: 0;
      z-index: 1050;
      width: 260px;
      flex-shrink: 0;
    "
  >
    <div class="sidebar-heading py-4 px-4 d-flex align-items-center mb-2">
      <div
        class="bg-primary text-white rounded-3 p-1 me-3 d-flex align-items-center justify-content-center shadow-sm"
        style="width: 36px; height: 36px"
      >
        <i class="bi bi-robot fs-4"></i>
      </div>
      <span class="fs-5 fw-bold text-dark tracking-tight">AI Admin</span>
    </div>

    <div
      class="list-group list-group-flush pt-2 overflow-auto custom-scrollbar"
      style="height: calc(100vh - 90px)"
    >
      <!-- GLOBAL NAVIGATION -->
      <template v-if="!isWorkspaceContext">
        <div
          class="px-4 mb-3 text-uppercase text-secondary fw-semibold extra-small"
          style="letter-spacing: 0.05em; opacity: 0.7"
        >
          Super Admin (Internal)
        </div>

        <NuxtLink
          to="/"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path === '/' }"
        >
          <i class="bi bi-speedometer2 me-3 fs-5"></i>
          <span class="fw-medium">Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/organization"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path.startsWith('/organization') }"
        >
          <i class="bi bi-people me-3 fs-5"></i>
          <span class="fw-medium">Organizations</span>
        </NuxtLink>

        <div
          class="px-4 mt-4 mb-3 text-uppercase text-secondary fw-semibold extra-small"
          style="letter-spacing: 0.05em; opacity: 0.7"
        >
          Integrations
        </div>
        <NuxtLink
          to="/integrations/api-keys"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path.startsWith('/integrations/api-keys') }"
        >
          <i class="bi bi-key me-3 fs-5"></i>
          <span class="fw-medium">API Keys</span>
        </NuxtLink>

        <div
          class="px-4 mt-4 mb-3 text-uppercase text-secondary fw-semibold extra-small"
          style="letter-spacing: 0.05em; opacity: 0.7"
        >
          Logging
        </div>
        <NuxtLink
          to="/logging/activity"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
        >
          <i class="bi bi-person-lines-fill me-3 fs-5"></i>
          <span class="fw-medium">Activity Logs</span>
        </NuxtLink>
        <NuxtLink
          to="/logging/integration"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
        >
          <i class="bi bi-cpu me-3 fs-5"></i>
          <span class="fw-medium">Integration Logs</span>
        </NuxtLink>

        <!-- Settings removed per user request -->
      </template>

      <!-- ORGANIZATION WORKSPACE NAVIGATION -->
      <template v-else>
        <div class="px-3 mb-4">
          <div
            class="card bg-light border-0 rounded-3 p-3 shadow-none overflow-hidden position-relative"
          >
            <div class="d-flex align-items-center mb-3">
              <img
                :src="customerStore.currentCustomer?.avatar"
                class="rounded-circle me-3 border-2 border-white shadow-sm"
                width="36"
                height="36"
              />
              <div class="flex-grow-1 min-width-0">
                <div class="fw-bold text-dark text-truncate lh-1 mb-1">
                  {{ customerStore.currentCustomer?.name }}
                </div>
                <div class="text-secondary extra-small mb-1 text-truncate">
                  {{ customerStore.currentCustomer?.businessName }}
                </div>
                <div class="d-flex align-items-center">
                  <span
                    class="badge extra-small px-2 py-1 rounded-pill fw-bold bg-success-subtle text-success border-0"
                    v-if="customerStore.currentCustomer?.status === 'active'"
                    style="font-size: 0.6rem"
                  >
                    ACTIVE
                  </span>
                  <span
                    class="badge extra-small px-2 py-1 rounded-pill fw-bold bg-danger-subtle text-danger border-0"
                    v-else
                    style="font-size: 0.6rem"
                  >
                    SUSPENDED
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="exitWorkspace"
              class="btn btn-sm btn-white w-100 py-1 extra-small fw-semibold border shadow-sm text-secondary transition-all"
            >
              <i class="bi bi-box-arrow-left me-1"></i> Exit Organization
            </button>
          </div>
        </div>

        <div
          class="px-4 mb-3 text-uppercase text-secondary fw-semibold extra-small"
          style="letter-spacing: 0.05em; opacity: 0.7"
        >
          Organization Workspace
        </div>

        <NuxtLink
          :to="`/organization/${customerId as string}/workspace`"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{
            active:
              $route.path.includes('/workspace') ||
              $route.path.includes('/waba-overview'),
          }"
        >
          <i class="bi bi-whatsapp me-3 fs-5"></i>
          <span class="fw-medium">WABA Overview</span>
        </NuxtLink>

        <NuxtLink
          :to="`/organization/${customerId as string}/customer`"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path.includes('/customer') }"
        >
          <i class="bi bi-person me-3 fs-5"></i>
          <span class="fw-medium">Customer</span>
        </NuxtLink>

        <NuxtLink
          :to="`/organization/${customerId as string}/whatsapp`"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{
            active:
              $route.path.includes('/whatsapp') &&
              !$route.path.endsWith(customerId as string),
          }"
        >
          <i class="bi bi-gear-wide-connected me-3 fs-5"></i>
          <span class="fw-medium">API Configuration</span>
        </NuxtLink>

        <NuxtLink
          :to="`/organization/${customerId as string}/templates`"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path.includes('/templates') }"
        >
          <i class="bi bi-file-earmark-text me-3 fs-5"></i>
          <span class="fw-medium">Message Templates</span>
        </NuxtLink>

        <NuxtLink
          :to="`/organization/${customerId as string}/inbox`"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path.includes('/inbox') }"
        >
          <i class="bi bi-chat-dots me-3 fs-5"></i>
          <span class="fw-medium">Conversation Inbox</span>
        </NuxtLink>

        <NuxtLink
          :to="`/organization/${customerId as string}/knowledge`"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path.includes('/knowledge') }"
        >
          <i class="bi bi-book me-3 fs-5"></i>
          <span class="fw-medium">Knowledge Base</span>
        </NuxtLink>

        <NuxtLink
          :to="`/organization/${customerId as string}/usage`"
          class="list-group-item list-group-item-action d-flex align-items-center py-2 px-4 mb-1"
          :class="{ active: $route.path.includes('/usage') }"
        >
          <i class="bi bi-graph-up me-3 fs-5"></i>
          <span class="fw-medium">Usage & Cost</span>
        </NuxtLink>

        <div
          class="px-4 mt-4 mb-3 text-uppercase text-secondary fw-semibold extra-small"
          style="letter-spacing: 0.05em; opacity: 0.7"
        >
          Operations
        </div>

        <!-- Logs Parent Item -->
        <div
          class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2 px-4 mb-1 border-0 rounded-3 mx-2 w-auto"
          style="cursor: pointer"
          @click="toggleSubmenu('logs')"
          :class="{
            'bg-primary bg-opacity-10 text-primary':
              activeSubmenu === 'logs' || $route.path.includes('/logs'),
          }"
        >
          <div class="d-flex align-items-center">
            <i class="bi bi-file-text me-3 fs-5"></i>
            <span class="fw-medium">Logs</span>
          </div>
          <i
            :class="[
              'bi',
              activeSubmenu === 'logs' ? 'bi-chevron-down' : 'bi-chevron-right',
              'extra-small',
            ]"
          ></i>
        </div>

        <!-- Logs Submenu (Accordion) -->
        <div v-show="activeSubmenu === 'logs'">
          <div class="bg-light-subtle rounded-3 mx-2 py-1 mb-2">
            <NuxtLink
              :to="`/organization/${customerId as string}/logs/webhook`"
              class="list-group-item list-group-item-action d-flex align-items-center ps-5 py-2 extra-small mb-1 border-0"
              :class="{ active: $route.path.includes('/logs/webhook') }"
            >
              <span class="fw-medium">Webhook Logs</span>
            </NuxtLink>
            <NuxtLink
              :to="`/organization/${customerId as string}/logs/ai`"
              class="list-group-item list-group-item-action d-flex align-items-center ps-5 py-2 extra-small border-0"
              :class="{ active: $route.path.includes('/logs/ai') }"
            >
              <span class="fw-medium">AI Assistant Logs</span>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomerStore } from "~/stores/customer";

const customerStore = useCustomerStore();
const router = useRouter();
const route = useRoute();

const customerId = computed(() => customerStore.selectedCustomerId);
const isWorkspaceRoute = computed(() =>
  /^\/(organization|customers)\/[^/]+(\/|$)/.test(route.path),
);
const isWorkspaceContext = computed(
  () => Boolean(customerStore.selectedCustomerId) && isWorkspaceRoute.value,
);
const activeSubmenu = ref<string>("");
const isManualToggle = ref(false);

function toggleSubmenu(menu: string) {
  isManualToggle.value = true;
  if (activeSubmenu.value === menu) {
    activeSubmenu.value = "";
  } else {
    activeSubmenu.value = menu;
  }
}

// Auto-expand menu if current route matches, but only if not manually toggled
watch(
  () => route.path,
  (newPath) => {
    if (!isManualToggle.value) {
      if (newPath.includes("/logs")) {
        activeSubmenu.value = "logs";
      } else {
        activeSubmenu.value = "";
      }
    }
  },
  { immediate: true },
);

function exitWorkspace() {
  customerStore.selectCustomer(null);
  router.push("/organization");
}
</script>

<style scoped>
.transition-transform {
  transition: transform 0.2s ease;
}
.rotate-180 {
  transform: rotate(180deg);
}
.extra-small {
  font-size: 0.7rem;
}
</style>
