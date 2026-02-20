<template>
  <div id="sidebar-wrapper" style="height: 100vh; position: sticky; top: 0; z-index: 1050; width: 260px; flex-shrink: 0;">
    <div class="sidebar-heading py-4 px-4 d-flex align-items-center">
        <div class="bg-primary text-white rounded p-1 me-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 32px; height: 32px;">
            <i class="bi bi-robot fs-5"></i>
        </div>
        <span class="fs-5 fw-bold text-dark">AI Admin</span>
    </div>
    
    <div class="list-group list-group-flush pt-2 overflow-auto" style="height: calc(100vh - 80px);">
      <!-- GLOBAL NAVIGATION -->
      <template v-if="!customerStore.selectedCustomerId">
        <div class="px-4 mb-2 text-uppercase text-muted fw-bold extra-small" style="letter-spacing: 1px;">Global Admin</div>
        
        <NuxtLink to="/" class="list-group-item list-group-item-action d-flex align-items-center py-3" :class="{ 'active': $route.path === '/' }">
            <i class="bi bi-speedometer2 me-3"></i> Dashboard
        </NuxtLink>
        
        <NuxtLink to="/customers" class="list-group-item list-group-item-action d-flex align-items-center py-3" :class="{ 'active': $route.path === '/customers' }">
            <i class="bi bi-people me-3"></i> Customers
        </NuxtLink>

        <div class="px-4 mt-4 mb-2 text-uppercase text-muted fw-bold extra-small" style="letter-spacing: 1px;">System</div>
        <NuxtLink to="/settings" class="list-group-item list-group-item-action d-flex align-items-center py-3">
            <i class="bi bi-gear me-3"></i> Settings
        </NuxtLink>
      </template>

      <!-- CUSTOMER WORKSPACE NAVIGATION -->
      <template v-else>
        <div class="px-3 mb-3">
          <div class="card bg-primary-subtle border-0 rounded-3 p-3 shadow-none">
            <div class="d-flex align-items-center mb-2">
              <img :src="customerStore.currentCustomer?.avatar" class="rounded-circle me-2 border bg-white flex-shrink-0 shadow-sm" width="28" height="28">
              <div class="flex-grow-1 min-width-0">
                <div class="fw-bold small text-truncate text-primary lh-sm">{{ customerStore.currentCustomer?.name }}</div>
                <div class="d-flex align-items-center mt-1">
                  <span class="badge extra-small p-1 px-2 rounded-pill fw-bold bg-success text-white" v-if="customerStore.currentCustomer?.status === 'active'" style="font-size: 0.6rem; letter-spacing: 0.5px;">
                    ACTIVE
                  </span>
                  <span class="badge extra-small p-1 px-2 rounded-pill fw-bold bg-danger text-white" v-else style="font-size: 0.6rem; letter-spacing: 0.5px;">
                    SUSPENDED
                  </span>
                </div>
              </div>
            </div>
            <button @click="exitWorkspace" class="btn btn-sm btn-white w-100 py-1 extra-small fw-bold border shadow-xs text-primary mt-1">
              <i class="bi bi-arrow-left me-1"></i> Exit Workspace
            </button>
          </div>
        </div>

        <div class="px-4 mb-2 text-uppercase text-muted fw-bold extra-small" style="letter-spacing: 1px;">Workspace</div>

        <NuxtLink :to="`/customers/${customerId}/waba-overview`" class="list-group-item list-group-item-action d-flex align-items-center py-2" :class="{ 'active': $route.path.includes('/waba-overview') }">
            <i class="bi bi-whatsapp me-3 text-success"></i> WABA Overview
        </NuxtLink>

        <NuxtLink :to="`/customers/${customerId}/whatsapp`" class="list-group-item list-group-item-action d-flex align-items-center py-2" :class="{ 'active': $route.path.includes('/whatsapp') && !$route.path.endsWith(customerId) }">
            <i class="bi bi-gear-wide-connected me-3 text-secondary"></i> API Configuration
        </NuxtLink>

        <NuxtLink :to="`/customers/${customerId}/templates`" class="list-group-item list-group-item-action d-flex align-items-center py-2" :class="{ 'active': $route.path.includes('/templates') }">
            <i class="bi bi-file-earmark-text me-3 text-secondary"></i> Message Templates
        </NuxtLink>

        <NuxtLink :to="`/customers/${customerId}/inbox`" class="list-group-item list-group-item-action d-flex align-items-center py-2" :class="{ 'active': $route.path.includes('/inbox') }">
            <i class="bi bi-chat-dots me-3 text-info"></i> Conversation Inbox
        </NuxtLink>

        <NuxtLink :to="`/customers/${customerId}/knowledge`" class="list-group-item list-group-item-action d-flex align-items-center py-2" :class="{ 'active': $route.path.includes('/knowledge') }">
            <i class="bi bi-book me-3 text-primary"></i> Knowledge Base
        </NuxtLink>

        <NuxtLink :to="`/customers/${customerId}/usage`" class="list-group-item list-group-item-action d-flex align-items-center py-2" :class="{ 'active': $route.path.includes('/usage') }">
            <i class="bi bi-graph-up me-3 text-warning"></i> Usage & Cost
        </NuxtLink>

        <div class="px-4 mt-4 mb-2 text-uppercase text-muted fw-bold extra-small" style="letter-spacing: 1px;">Operations</div>
        
        <div 
          class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2" 
          style="cursor: pointer;"
          @click="isLogsOpen = !isLogsOpen"
        >
          <div class="d-flex align-items-center">
            <i class="bi bi-file-text me-3"></i>
            <span>Logs</span>
          </div>
          <i :class="['bi bi-chevron-down small transition-transform', { 'rotate-180': isLogsOpen }]"></i>
        </div>
        
        <div v-show="isLogsOpen" class="bg-light-subtle rounded mx-2">
          <NuxtLink :to="`/customers/${customerId}/logs/webhook`" class="list-group-item list-group-item-action d-flex align-items-center ps-4 py-2 small" :class="{ 'active': $route.path.includes('/logs/webhook') }">
            Webhook Logs
          </NuxtLink>
          <NuxtLink :to="`/customers/${customerId}/logs/ai`" class="list-group-item list-group-item-action d-flex align-items-center ps-4 py-2 small" :class="{ 'active': $route.path.includes('/logs/ai') }">
            AI Assistant Logs
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();
const router = useRouter();
const route = useRoute();

const customerId = computed(() => customerStore.selectedCustomerId);
const isLogsOpen = ref(route.path.includes('/logs'));

function exitWorkspace() {
  customerStore.selectCustomer(null);
  router.push('/customers');
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
