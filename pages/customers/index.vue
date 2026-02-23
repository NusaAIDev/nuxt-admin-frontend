<template>
  <div>
    <div class="d-flex justify-content-between align-items-end mb-40">
        <div>
            <h2 class="fw-bold text-dark mb-2">Organizations</h2>
            <p class="text-secondary mb-0 fs-5">Manage organizations and open workspace modules</p>
        </div>
        <NuxtLink to="/organization/create" class="btn btn-primary px-4 py-2 shadow-sm">
            <i class="bi bi-plus-lg me-2"></i>Add Organization
        </NuxtLink>
    </div>

    <!-- Search Bar -->
    <div class="card border shadow-sm mb-32">
        <div class="card-body p-3">
            <div class="input-group input-group-lg border-0">
                <span class="input-group-text bg-transparent border-0 pe-2">
                    <i class="bi bi-search text-muted opacity-50"></i>
                </span>
                <input type="text" class="form-control border-0 shadow-none fs-6" placeholder="Search by contact name, organization, or number..." v-model="searchQuery">
            </div>
        </div>
    </div>

    <div v-if="customerStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary opacity-50" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="customerStore.error" class="alert alert-danger border-0 shadow-sm">
        <i class="bi bi-exclamation-triangle me-2"></i> {{ customerStore.error }}
    </div>

    <div v-else class="card border shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th class="ps-4 py-3">Admin Contact</th>
                            <th class="py-3">Organization</th>
                            <th class="py-3">WhatsApp</th>
                            <th class="py-3">Status</th>
                            <th class="py-3">AI Mode</th>
                            <th class="py-3">Messages/mo</th>
                            <th class="py-3">Created</th>
                            <th class="text-end pe-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in filteredCustomers" :key="customer.id" class="cursor-pointer" @click="selectCustomer(customer)">
                            <td class="ps-4 py-3">
                                <div class="d-flex align-items-center">
                                    <img :src="customer.avatar" alt="Avatar" class="rounded-circle me-3 border shadow-xs" width="36" height="36">
                                    <span class="fw-semibold text-dark">{{ customer.name }}</span>
                                </div>
                            </td>
                            <td class="py-3 text-secondary">{{ customer.businessName }}</td>
                            <td class="py-3">
                                <span class="text-secondary fw-medium">
                                    <i class="bi bi-whatsapp text-success opacity-75 me-1"></i>
                                    {{ customer.whatsappNumber }}
                                </span>
                            </td>
                            <td class="py-3">
                                <span :class="customer.status === 'active' ? 'badge bg-success-subtle text-success border-0 px-3' : 'badge bg-danger-subtle text-danger border-0 px-3'" class="fw-bold">
                                    {{ customer.status.toUpperCase() }}
                                </span>
                            </td>
                            <td class="py-3">
                                <span :class="customer.aiModeDefault ? 'badge bg-primary-subtle text-primary border-0 px-3' : 'badge bg-secondary-subtle text-secondary border-0 px-3'" class="fw-bold">
                                    {{ customer.aiModeDefault ? 'ENABLED' : 'DISABLED' }}
                                </span>
                            </td>
                            <td class="py-3">
                                <span class="text-dark fw-semibold">{{ customer.messagesThisMonth.toLocaleString() }}</span>
                            </td>
                            <td class="py-3 text-secondary small">{{ formatDate(customer.createdDate) }}</td>
                            <td class="text-end pe-4 py-3">
                                <div class="d-flex justify-content-end gap-2">
                                    <button class="btn btn-sm btn-primary px-3 shadow-sm" @click.stop="selectCustomer(customer)">
                                        Open
                                    </button>
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
  router.push(`/organization/${customer.id}/workspace`);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

useHead({
  title: 'Organizations - AI Admin'
});

onMounted(() => {
  customerStore.fetchCustomers();
});
</script>
