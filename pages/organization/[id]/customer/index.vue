<template>
  <div v-if="customer">
    <div class="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold mb-1">Customer</h4>
        <p class="text-secondary small mb-0">List customer contacts for this organization.</p>
      </div>
      <button class="btn btn-primary" @click="goToCreateCustomer">
        <i class="bi bi-plus-lg me-1"></i> Create Customer
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th class="ps-4 py-3 text-secondary extra-small fw-semibold">FULL NAME</th>
                <th class="py-3 text-secondary extra-small fw-semibold">JOB ROLE</th>
                <th class="py-3 text-secondary extra-small fw-semibold">EMAIL</th>
                <th class="py-3 text-secondary extra-small fw-semibold">TYPE</th>
                <th class="py-3 text-secondary extra-small fw-semibold">STATUS</th>
                <th class="py-3 text-secondary extra-small fw-semibold text-end pe-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in contacts" :key="item.id">
                <td class="ps-4">{{ item.fullName }}</td>
                <td>{{ item.jobRole || "-" }}</td>
                <td>{{ item.email || "-" }}</td>
                <td>
                  <span
                    class="badge"
                    :class="item.roleType === 'primary'
                      ? 'bg-primary-subtle text-primary'
                      : 'bg-light text-secondary border'"
                  >
                    {{ item.roleType === "primary" ? "REGISTERED (PRIMARY)" : "OPERATOR" }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="item.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'"
                  >
                    {{ item.isActive ? "ACTIVE" : "INACTIVE" }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-2">
                    <button
                      v-if="item.roleType === 'operator'"
                      class="btn btn-sm"
                      :class="item.assigned ? 'btn-outline-danger' : 'btn-outline-primary'"
                      @click="toggleAssigned(item.id)"
                    >
                      {{ item.assigned ? "Unassign" : "Assign" }}
                    </button>
                    <button class="btn btn-sm btn-primary" @click="goToCustomerDetail(item.id)">
                      Detail
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
import { useCustomerStore } from "~/stores/customer";
import { useWorkspaceCustomers } from "~/composables/useWorkspaceCustomers";

definePageMeta({
  alias: [
    "/organization/:id/customer",
    "/organization/:id/profile",
  ],
});

const route = useRoute();
const router = useRouter();
const organizationId = route.params.id as string;
const customerStore = useCustomerStore();
const customer = computed(() => customerStore.currentCustomer);

const workspaceCustomers = useWorkspaceCustomers(organizationId);
const contacts = workspaceCustomers.list;

watch(
  customer,
  (value) => {
    if (!value) return;
    workspaceCustomers.initializeFromPrimary({
      fullName: value.name || "",
      jobRole: value.role || "",
      email: value.email || "",
      whatsappNumber: value.whatsappNumber || value.phone || "",
      address: value.address || "",
      internalNotes: value.notes || "",
    });
  },
  { immediate: true },
);

function toggleAssigned(contactId: string) {
  workspaceCustomers.toggleAssigned(contactId);
}

function goToCreateCustomer() {
  router.push(`/organization/${organizationId}/customer/create`);
}

function goToCustomerDetail(contactId: string) {
  router.push(`/organization/${organizationId}/customer/${contactId}`);
}

onMounted(() => {
  if (!customerStore.currentCustomer) {
    customerStore.fetchCustomerById(organizationId);
  }
});

useHead({
  title: `${customer.value?.name || "Customer"} - AI Admin`,
});
</script>

<style scoped>
.extra-small {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}
</style>
