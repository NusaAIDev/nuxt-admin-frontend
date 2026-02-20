<template>
  <div class="dropdown me-3" v-if="customerStore.selectedCustomerId">
    <button 
      class="btn btn-link text-decoration-none dropdown d-flex align-items-center p-1 rounded-pill hover-bg" 
      type="button" 
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <img 
        :src="currentCustomer?.avatar || 'https://ui-avatars.com/api/?name=C&background=4F46E5&color=fff'" 
        class="rounded-circle me-2" 
        width="24" 
        height="24"
      >
      <div class="text-start flex-grow-1 overflow-hidden pe-2">
        <div class="fw-bold small text-truncate" style="max-width: 150px;">{{ currentCustomer?.name || 'Loading...' }}</div>
      </div>
    </button>
    <div class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" style="width: 300px;">
      <div class="px-3 py-2 border-bottom mb-2">
        <input 
          type="text" 
          class="form-control form-control-sm" 
          placeholder="Search customers..." 
          v-model="search"
          @click.stop
        >
      </div>
      <div class="overflow-auto" style="max-height: 250px;">
        <button 
          v-for="c in filteredCustomers" 
          :key="c.id" 
          class="dropdown-item rounded py-2 d-flex align-items-center mb-1"
          :class="{ 'active': c.id === customerStore.selectedCustomerId }"
          @click="switchCustomer(c.id)"
        >
          <img :src="c.avatar" class="rounded-circle me-3" width="32" height="32">
          <div class="overflow-hidden">
            <div class="fw-bold small text-truncate">{{ c.name }}</div>
            <div class="extra-small text-muted text-truncate">{{ c.businessName }}</div>
          </div>
        </button>
        <div v-if="filteredCustomers.length === 0" class="px-3 py-4 text-center text-muted small">
          No customers found
        </div>
      </div>
      <div class="border-top mt-2 pt-2 px-2">
        <NuxtLink to="/customers" class="btn btn-sm btn-light w-100 py-1 text-primary fw-bold">
          <i class="bi bi-people me-1"></i> View All Customers
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();
const router = useRouter();
const route = useRoute();
const search = ref('');

const currentCustomer = computed(() => customerStore.currentCustomer);

const filteredCustomers = computed(() => {
  return customerStore.customers.filter(c => 
    c.name.toLowerCase().includes(search.value.toLowerCase()) ||
    c.businessName.toLowerCase().includes(search.value.toLowerCase())
  );
});

async function switchCustomer(id: string) {
  if (id === customerStore.selectedCustomerId) return;
  
  // Scoped switch: keep the same sub-path if possible
  const pathParts = route.path.split('/');
  // current path: /customers/[id]/[module]
  if (pathParts[1] === 'customers' && pathParts[3]) {
    const module = pathParts[3];
    router.push(`/customers/${id}/${module}`);
  } else {
    router.push(`/customers/${id}/profile`);
  }
}

onMounted(() => {
  if (customerStore.customers.length === 0) {
    customerStore.fetchCustomers();
  }
});
</script>

<style scoped>
.hover-bg {
  transition: background-color 0.2s;
  color: #111827 !important;
}
.hover-bg:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.extra-small {
  font-size: 0.7rem;
  line-height: 1;
}
.dropdown-item.active {
  background-color: #EEF2FF;
  color: #4F46E5;
}
</style>
