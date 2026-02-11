<template>
  <div class="border-end" id="sidebar-wrapper" style="width: 260px; min-width: 260px;">
    <div class="sidebar-heading py-4 px-4 d-flex align-items-center">
        <div class="bg-primary text-white rounded p-1 me-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <i class="bi bi-robot fs-5"></i>
        </div>
        <span class="fs-5">AI Admin</span>
    </div>
    
    <div class="list-group list-group-flush pt-3">
      <div class="px-4 mb-2 text-uppercase text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">Menu</div>
      
      <NuxtLink to="/" class="list-group-item list-group-item-action d-flex align-items-center">
          <i class="bi bi-grid-1x2 me-3"></i> Dashboard
      </NuxtLink>
      
      <NuxtLink to="/customers" class="list-group-item list-group-item-action d-flex align-items-center" :class="{ 'active': $route.path.startsWith('/customers') && !customerStore.currentCustomer }">
          <i class="bi bi-people me-3"></i> Customers
      </NuxtLink>

      <div v-if="customerStore.currentCustomer" class="mt-4">
          <div class="px-4 mb-2 text-uppercase text-muted fw-bold d-flex justify-content-between align-items-center" style="font-size: 0.75rem; letter-spacing: 1px;">
              <span>{{ customerStore.currentCustomer.name }}</span>
              <NuxtLink to="/customers" class="text-muted"><i class="bi bi-x-circle hover-text-white"></i></NuxtLink>
          </div>
          
          <NuxtLink :to="`/customers/${customerStore.currentCustomer.id}/inbox`" class="list-group-item list-group-item-action d-flex align-items-center">
              <i class="bi bi-inbox me-3"></i> Inbox
          </NuxtLink>
          <NuxtLink :to="`/customers/${customerStore.currentCustomer.id}/dataset`" class="list-group-item list-group-item-action d-flex align-items-center">
              <i class="bi bi-database me-3"></i> Dataset
          </NuxtLink>
          <NuxtLink :to="`/customers/${customerStore.currentCustomer.id}/ai-config`" class="list-group-item list-group-item-action d-flex align-items-center">
              <i class="bi bi-sliders me-3"></i> AI Config
          </NuxtLink>
          <NuxtLink :to="`/customers/${customerStore.currentCustomer.id}/logs`" class="list-group-item list-group-item-action d-flex align-items-center">
              <i class="bi bi-clock-history me-3"></i> Chat Logs
          </NuxtLink>
      </div>
      
      <div class="mt-4">
          <div class="px-4 mb-2 text-uppercase text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">System</div>
          <NuxtLink to="/settings" class="list-group-item list-group-item-action d-flex align-items-center">
              <i class="bi bi-gear me-3"></i> Settings
          </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();
</script>

<style scoped>
.list-group-item-action {
    text-decoration: none !important;
}
.list-group-item-action:hover {
    text-decoration: none !important;
}
.router-link-active {
    font-weight: 600;
    text-decoration: none !important;
}
</style>
