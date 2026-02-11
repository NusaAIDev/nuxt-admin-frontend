<template>
  <div>
    <div v-if="customerStore.loading" class="text-center mt-5">
         <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else-if="customerStore.currentCustomer">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>{{ customerStore.currentCustomer.name }}</h2>
            <span class="badge bg-secondary">{{ customerStore.currentCustomer.status }}</span>
        </div>
        
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <NuxtLink :to="`/customers/${route.params.id}/inbox`" class="nav-link" active-class="active">
                    Inbox
                </NuxtLink>
            </li>
            <li class="nav-item">
                <NuxtLink :to="`/customers/${route.params.id}/dataset`" class="nav-link" active-class="active">
                    Dataset
                </NuxtLink>
            </li>
            <li class="nav-item">
                <NuxtLink :to="`/customers/${route.params.id}/ai-config`" class="nav-link" active-class="active">
                    AI Config
                </NuxtLink>
            </li>
             <li class="nav-item">
                <NuxtLink :to="`/customers/${route.params.id}/logs`" class="nav-link" active-class="active">
                    Chat Logs
                </NuxtLink>
            </li>
        </ul>

        <div class="card p-4">
             <NuxtPage />
        </div>
    </div>
    <div v-else class="alert alert-warning">
        Customer not found or loading...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const route = useRoute();
const customerStore = useCustomerStore();

onMounted(async () => {
    // If we land directly here, we need to fetch the customer
    if (!customerStore.currentCustomer || customerStore.currentCustomer.id !== route.params.id) {
        await customerStore.fetchCustomerById(route.params.id as string);
    }
});
</script>

<style scoped>
.nav-link.active {
    font-weight: bold;
    border-bottom: 3px solid #0d6efd;
}
</style>
