<template>
  <div>
    <div class="mb-4">
      <h4 class="fw-bold mb-1">Operational Logs</h4>
      <p class="text-secondary small mb-0">System level audit trails and AI interaction logs.</p>
    </div>

    <div class="nav-tabs-wrapper mb-4">
      <ul class="nav nav-tabs border-bottom-0">
        <li class="nav-item">
          <NuxtLink 
            :to="`/customers/${customerId}/logs/webhook`" 
            class="nav-link"
            :class="{ 'active': $route.path.includes('/webhook') }"
          >
            <i class="bi bi-link-45deg me-1"></i> Webhook
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink 
            :to="`/customers/${customerId}/logs/ai`" 
            class="nav-link"
            :class="{ 'active': $route.path.includes('/ai') }"
          >
            <i class="bi bi-robot me-1"></i> AI Assistant
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="p-3 bg-white border rounded shadow-sm min-vh-25">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const customerId = route.params.id as string;
</script>

<style scoped>
.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
}
.nav-tabs .nav-link.active {
  color: #4F46E5;
  border-bottom: 2px solid #4F46E5;
  background-color: transparent;
}
.min-vh-25 {
  min-height: 25vh;
}
</style>
