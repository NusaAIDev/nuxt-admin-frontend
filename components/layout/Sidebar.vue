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
          <i class="bi bi-house me-3"></i> Dashboard
      </NuxtLink>
      
      <NuxtLink to="/customers" class="list-group-item list-group-item-action d-flex align-items-center" :class="{ 'active': $route.path.startsWith('/customers') }">
          <i class="bi bi-people me-3"></i> Customers
      </NuxtLink>

      <div class="mt-2">
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
        
        <div v-show="isLogsOpen" class="bg-light-subtle transition-all">
          <NuxtLink to="/logs/webhook" class="list-group-item list-group-item-action d-flex align-items-center ps-5 py-2" :class="{ 'active': $route.path.startsWith('/logs/webhook') }">
            <i class="bi bi-link-45deg me-2"></i> Webhook Logs
          </NuxtLink>
          <NuxtLink to="/logs/ai" class="list-group-item list-group-item-action d-flex align-items-center ps-5 py-2" :class="{ 'active': $route.path.startsWith('/logs/ai') }">
            <i class="bi bi-robot me-2"></i> AI Logs
          </NuxtLink>
          <NuxtLink to="/logs/system" class="list-group-item list-group-item-action d-flex align-items-center ps-5 py-2" :class="{ 'active': $route.path.startsWith('/logs/system') }">
            <i class="bi bi-cpu me-2"></i> System Logs
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';
import { useRouter, useRoute } from 'vue-router';

const customerStore = useCustomerStore();
const router = useRouter();
const route = useRoute();

const isLogsOpen = ref(route.path.startsWith('/logs'));

function clearCustomer() {
  customerStore.currentCustomer = null;
  router.push('/customers');
}
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

.transition-transform {
    transition: transform 0.2s ease;
}

.rotate-180 {
    transform: rotate(180deg);
}

.bg-light-subtle {
    background-color: rgba(0, 0, 0, 0.02);
}

.transition-all {
    transition: all 0.3s ease-in-out;
}
</style>
