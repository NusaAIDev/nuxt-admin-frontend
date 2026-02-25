<template>
  <div v-if="customer" class="h-100 d-flex flex-column">
    <NuxtPage />
  </div>
  <div v-else-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else class="alert alert-danger">Organization not found</div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";

const route = useRoute();
const customerStore = useCustomerStore();
const customerId = route.params.id as string;

const customer = computed(() => customerStore.currentCustomer);
const loading = computed(() => customerStore.loading);

onMounted(async () => {
  if (
    !customerStore.currentCustomer ||
    customerStore.currentCustomer.id !== customerId
  ) {
    await customerStore.fetchCustomerById(customerId);
  }
});
</script>
