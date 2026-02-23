<template>
  <div>
    <h2>Add New Customer</h2>
    <div class="row mt-4">
        <div class="col-md-6">
            <form @submit.prevent="saveCustomer">
                 <div class="mb-3">
                    <label for="name" class="form-label">Customer Name</label>
                    <input type="text" class="form-control" id="name" v-model="form.name" required>
                </div>
                 <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="email" v-model="form.email" required>
                </div>
                 <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input type="text" class="form-control" id="phone" v-model="form.phone">
                </div>
                 <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" v-model="form.status">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                 <div class="mb-3">
                    <label for="instruction" class="form-label">Initial System Instruction</label>
                    <textarea class="form-control" id="instruction" rows="3" v-model="form.system_instruction"></textarea>
                </div>
                
                <button type="submit" class="btn btn-success" :disabled="customerStore.loading">
                    <span v-if="customerStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Create Customer
                </button>
                 <NuxtLink to="/organization" class="btn btn-secondary ms-2">Cancel</NuxtLink>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();
const router = useRouter();

const form = reactive({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive',
    avatar: 'https://ui-avatars.com/api/?background=random', // placeholder
    system_instruction: ''
});

async function saveCustomer() {
    form.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random`;
    await customerStore.addCustomer(form);
    if (!customerStore.error) {
        router.push('/organization');
    }
}
</script>
