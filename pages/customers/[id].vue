<template>
  <div v-if="customer" class="h-100 d-flex flex-column">
    <!-- Floating Workspace Card -->
    <div class="card shadow-sm border-0 rounded-4 flex-grow-1 overflow-hidden">
      <div class="p-0 flex-grow-1 d-flex flex-column overflow-hidden">
        <template v-if="customer">
          <NuxtPage />
        </template>
        <template v-else>
          <SelectionRequired />
        </template>
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
import SelectionRequired from '~/components/common/SelectionRequired.vue';

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
.min-vh-75 {
  min-height: 75vh;
}
</style>
