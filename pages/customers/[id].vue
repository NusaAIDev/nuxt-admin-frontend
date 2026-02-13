<template>
  <div v-if="customer">
    <!-- Customer Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <NuxtLink to="/customers" class="btn btn-white border shadow-sm me-3">
          <i class="bi bi-arrow-left"></i>
        </NuxtLink>
        <div>
          <h3 class="fw-bold text-dark mb-1">{{ customer.name }}</h3>
          <p class="text-secondary mb-0">{{ customer.businessName }} • {{ customer.whatsappNumber }}</p>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <span :class="['badge me-3', customer.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
          {{ customer.status.toUpperCase() }}
        </span>
        <div class="dropdown">
          <button class="btn btn-white border shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Edit Details</a></li>
            <li><a class="dropdown-item text-danger" href="#">Suspend Customer</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <NuxtLink :to="`/customers/${customerId}/whatsapp`" class="btn btn-nav w-100 p-3 shadow-sm border-0" :class="{ 'active': $route.path.includes('/whatsapp') }">
          <div class="icon-box bg-success-subtle text-success mb-2">
            <i class="bi bi-whatsapp fs-4"></i>
          </div>
          <div class="fw-bold">WhatsApp</div>
          <div class="small text-muted">Integration</div>
        </NuxtLink>
      </div>
      <div class="col-6 col-md-3">
        <NuxtLink :to="`/customers/${customerId}/knowledge`" class="btn btn-nav w-100 p-3 shadow-sm border-0" :class="{ 'active': $route.path.includes('/knowledge') }">
          <div class="icon-box bg-primary-subtle text-primary mb-2">
            <i class="bi bi-book fs-4"></i>
          </div>
          <div class="fw-bold">Knowledge</div>
          <div class="small text-muted">Dataset</div>
        </NuxtLink>
      </div>
      <div class="col-6 col-md-3">
        <NuxtLink :to="`/customers/${customerId}/inbox`" class="btn btn-nav w-100 p-3 shadow-sm border-0" :class="{ 'active': $route.path.includes('/inbox') }">
          <div class="icon-box bg-info-subtle text-info mb-2">
            <i class="bi bi-chat-dots fs-4"></i>
          </div>
          <div class="fw-bold">Inbox</div>
          <div class="small text-muted">Conversations</div>
        </NuxtLink>
      </div>
      <div class="col-6 col-md-3">
        <NuxtLink :to="`/customers/${customerId}/usage`" class="btn btn-nav w-100 p-3 shadow-sm border-0" :class="{ 'active': $route.path.includes('/usage') }">
          <div class="icon-box bg-warning-subtle text-warning mb-2">
            <i class="bi bi-graph-up fs-4"></i>
          </div>
          <div class="fw-bold">Usage Panel</div>
          <div class="small text-muted">Metrics & Cost</div>
        </NuxtLink>
      </div>
    </div>

    <!-- Content Area -->
    <div class="card shadow-sm border-0 min-vh-50">
      <div class="card-body p-4">
        <NuxtPage />
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else class="alert alert-danger">
    Customer not found
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const route = useRoute();
const customerStore = useCustomerStore();
const customerId = route.params.id as string;

const customer = computed(() => customerStore.currentCustomer);
const loading = computed(() => customerStore.loading);

onMounted(async () => {
  if (!customerStore.currentCustomer || customerStore.currentCustomer.id !== customerId) {
    await customerStore.fetchCustomerById(customerId);
  }
});
</script>

<style scoped>
.btn-nav {
  background-color: white;
  transition: all 0.2s;
  text-align: center;
}
.btn-nav:hover {
  transform: translateY(-2px);
  background-color: #f9fafb;
}
.btn-nav.active {
  background-color: #EEF2FF;
  border: 1px solid #4F46E5 !important;
}
.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.min-vh-50 {
  min-height: 50vh;
}
</style>
