<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold text-dark mb-1">Customers</h3>
            <p class="text-secondary mb-0">Manage your AI chatbot customers</p>
        </div>
        <NuxtLink to="/customers/create" class="btn btn-primary shadow-sm">
            <i class="bi bi-plus-lg me-2"></i>Add Customer
        </NuxtLink>
    </div>

    <!-- Search Bar -->
    <div class="card shadow-sm border-0 mb-4">
        <div class="card-body">
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search text-muted"></i>
                </span>
                <input type="text" class="form-control border-start-0" placeholder="Search customers..." v-model="searchQuery">
            </div>
        </div>
    </div>

    <div v-if="customerStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="customerStore.error" class="alert alert-danger">
        {{ customerStore.error }}
    </div>

    <div v-else class="card shadow-sm border-0">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Customer Name</th>
                            <th>Business Name</th>
                            <th>WhatsApp Number</th>
                            <th>Status</th>
                            <th>AI Mode</th>
                            <th>Messages/Month</th>
                            <th>Created</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in filteredCustomers" :key="customer.id">
                            <td class="ps-4">
                                <div class="d-flex align-items-center">
                                    <img :src="customer.avatar" alt="Avatar" class="rounded-circle me-2" width="32" height="32">
                                    <span class="fw-medium">{{ customer.name }}</span>
                                </div>
                            </td>
                            <td>{{ customer.businessName }}</td>
                            <td>
                                <span class="text-muted">
                                    <i class="bi bi-whatsapp text-success me-1"></i>
                                    {{ customer.whatsappNumber }}
                                </span>
                            </td>
                            <td>
                                <span :class="{
                                    'badge bg-success-subtle text-success': customer.status === 'active',
                                    'badge bg-danger-subtle text-danger': customer.status === 'suspended'
                                }">
                                    {{ customer.status }}
                                </span>
                            </td>
                            <td>
                                <span :class="{
                                    'badge bg-primary-subtle text-primary': customer.aiModeDefault,
                                    'badge bg-secondary-subtle text-secondary': !customer.aiModeDefault
                                }">
                                    {{ customer.aiModeDefault ? 'ON' : 'OFF' }}
                                </span>
                            </td>
                            <td>
                                <span class="fw-medium">{{ customer.messagesThisMonth.toLocaleString() }}</span>
                            </td>
                            <td>{{ formatDate(customer.createdDate) }}</td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2">
                                    <NuxtLink :to="`/customers/${customer.id}/profile`" class="btn btn-sm btn-outline-secondary">
                                        <i class="bi bi-info-circle me-1"></i>Detail
                                    </NuxtLink>
                                    <NuxtLink :to="`/customers/${customer.id}/waba-overview`" class="btn btn-sm btn-primary">
                                        <i class="bi bi-box-arrow-in-right me-1"></i>Open Workspace
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';
import type { Customer } from '~/types';

const customerStore = useCustomerStore();
const router = useRouter();
const searchQuery = ref('');

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customerStore.customers;
  
  const query = searchQuery.value.toLowerCase();
  return customerStore.customers.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.businessName.toLowerCase().includes(query) ||
    c.whatsappNumber.includes(query)
  );
});

function selectCustomer(customer: Customer) {
  customerStore.currentCustomer = customer;
  router.push(`/customers/${customer.id}/whatsapp`);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

useHead({
  title: 'Customers - AI Admin'
});

onMounted(() => {
  customerStore.fetchCustomers();
});
</script>
