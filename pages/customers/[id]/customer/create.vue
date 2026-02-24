<template>
  <div>
    <div class="mb-4">
      <NuxtLink :to="`/organization/${organizationId}/customer`" class="btn btn-link text-decoration-none p-0 text-secondary mb-2">
        <i class="bi bi-arrow-left me-1"></i> Back to Customer List
      </NuxtLink>
      <h4 class="fw-bold mb-1">Create Customer</h4>
      <p class="text-secondary small mb-0">Add a new customer contact for this organization.</p>
    </div>

    <div class="card border-0 shadow-sm p-4">
      <form @submit.prevent="handleCreate">
        <div class="row g-4">
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">FULL NAME <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="form.fullName" required />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">JOB ROLE <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="form.jobRole" required />
          </div>
          <div class="col-md-6">
            <label class="form-label text-secondary fw-semibold extra-small">EMAIL ADDRESS <span class="text-danger">*</span></label>
            <input type="email" class="form-control" v-model="form.email" required />
          </div>
          <div class="col-12">
            <label class="form-label text-secondary fw-semibold extra-small">ADDRESS <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="form.address" required />
          </div>
          <div class="col-12">
            <label class="form-label text-secondary fw-semibold extra-small">INTERNAL NOTES <span class="text-danger">*</span></label>
            <textarea class="form-control" rows="4" v-model="form.internalNotes" required></textarea>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <NuxtLink :to="`/organization/${organizationId}/customer`" class="btn btn-light border">Cancel</NuxtLink>
          <button class="btn btn-primary" type="submit">Create Customer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceCustomers } from "~/composables/useWorkspaceCustomers";
import { useCustomerStore } from "~/stores/customer";

definePageMeta({
  alias: ["/organization/:id/customer/create", "/customers/:id/customer/create"],
});

const route = useRoute();
const router = useRouter();
const organizationId = route.params.id as string;
const workspaceCustomers = useWorkspaceCustomers(organizationId);
const customerStore = useCustomerStore();

const form = reactive({
  fullName: "",
  jobRole: "",
  email: "",
  address: "",
  internalNotes: "",
});

function handleCreate() {
  workspaceCustomers.addContact({
    fullName: form.fullName,
    jobRole: form.jobRole,
    email: form.email,
    address: form.address,
    internalNotes: form.internalNotes,
    roleType: "operator",
    assigned: false,
    isActive: false,
  });

  router.push(`/organization/${organizationId}/customer`);
}

onMounted(async () => {
  if (!customerStore.currentCustomer) {
    await customerStore.fetchCustomerById(organizationId);
  }
  if (customerStore.currentCustomer) {
    workspaceCustomers.initializeFromPrimary({
      fullName: customerStore.currentCustomer.name || "",
      jobRole: customerStore.currentCustomer.role || "",
      email: customerStore.currentCustomer.email || "",
      address: customerStore.currentCustomer.address || "",
      internalNotes: customerStore.currentCustomer.notes || "",
    });
  }
});

useHead({
  title: "Create Customer - AI Admin",
});
</script>

<style scoped>
.extra-small {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}
</style>
