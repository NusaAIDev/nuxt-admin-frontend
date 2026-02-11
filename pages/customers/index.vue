<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h1>Customers</h1>
        <NuxtLink to="/customers/add" class="btn btn-primary">
            <i class="bi bi-plus-lg"></i> Add Customer
        </NuxtLink>
    </div>

    <div v-if="customerStore.loading" class="text-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="customerStore.error" class="alert alert-danger">
        {{ customerStore.error }}
    </div>

    <div v-else class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="customer in customerStore.customers" :key="customer.id">
                    <td>
                        <img :src="customer.avatar" alt="Avatar" class="rounded-circle" width="32" height="32">
                    </td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.email }}</td>
                    <td>
                        <span :class="{'badge bg-success': customer.status === 'active', 'badge bg-secondary': customer.status !== 'active'}">
                            {{ customer.status }}
                        </span>
                    </td>
                    <td>
                        <NuxtLink :to="`/customers/${customer.id}/inbox`" class="btn btn-sm btn-outline-primary me-1">
                            Select
                        </NuxtLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();

useHead({
  title: 'Customers - AI Admin'
});

onMounted(() => {
    customerStore.fetchCustomers();
});
</script>
