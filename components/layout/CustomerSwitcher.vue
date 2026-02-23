<template>
  <div class="dropdown me-3 border-end pe-3" v-if="customerStore.selectedCustomerId">
    <button 
      class="btn btn-white border-0 d-flex align-items-center p-2 rounded-3" 
      type="button" 
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <img 
        :src="currentCustomer?.avatar || 'https://ui-avatars.com/api/?name=C&background=4F46E5&color=fff'" 
        class="rounded-circle me-3 border shadow-xs" 
        width="28" 
        height="28"
      >
      <div class="text-start pe-2">
        <div class="fw-bold text-dark lh-1" style="max-width: 140px; font-size: 0.9rem;">{{ currentCustomer?.name || 'Loading...' }}</div>
      </div>
      <i class="bi bi-chevron-down extra-small text-muted ms-auto"></i>
    </button>
    <div class="dropdown-menu dropdown-menu-end shadow-lg border mt-2 p-2 rounded-3" style="width: 320px;">
      <div class="px-3 pt-3 pb-2 mb-2">
        <h6 class="fw-bold text-dark mb-3">Switch Organization</h6>
        <div class="input-group input-group-sm bg-light rounded-3 px-2">
            <span class="input-group-text bg-transparent border-0 opacity-50 px-2">
                <i class="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control bg-transparent border-0 shadow-none py-2" 
              placeholder="Search organizations..."
              v-model="search"
              @click.stop
            >
        </div>
      </div>
      <div class="overflow-auto px-1" style="max-height: 280px;">
        <button 
          v-for="c in filteredCustomers" 
          :key="c.id" 
          class="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center mb-1"
          :class="{ 'active bg-primary-subtle border-0': c.id === customerStore.selectedCustomerId }"
          @click="switchCustomer(c.id)"
        >
          <img :src="c.avatar" class="rounded-circle me-3 border shadow-xs" width="36" height="36">
          <div class="overflow-hidden">
            <div class="fw-bold text-dark mb-0" style="font-size: 0.85rem;">{{ c.name }}</div>
            <div class="extra-small text-secondary text-truncate">{{ c.businessName }}</div>
          </div>
          <i v-if="c.id === customerStore.selectedCustomerId" class="bi bi-check2 text-primary ms-auto fs-5"></i>
        </button>
        <div v-if="filteredCustomers.length === 0" class="px-3 py-5 text-center text-muted small">
          <i class="bi bi-search mb-2 d-block fs-3 opacity-25"></i>
          No organizations found
        </div>
      </div>
      <div class="border-top mt-2 pt-2 px-2">
        <NuxtLink to="/organization" class="btn btn-sm btn-light w-100 py-2 text-secondary fw-semibold border-0">
          <i class="bi bi-grid-fill me-2 opacity-50"></i> View All Organizations
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
  // current path variants:
  // - /organization/[id]/[module]
  // - /organization/[id]/workspace
  if (pathParts[1] === 'organization' && pathParts[3]) {
    const module = pathParts[3];
    router.push(`/organization/${id}/${module}`);
  } else {
    router.push(`/organization/${id}/workspace`);
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
