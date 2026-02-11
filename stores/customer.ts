import { defineStore } from 'pinia';
import { customerService } from '~/services/customer.service';
import type { Customer } from '~/types';

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customers: [] as Customer[],
        currentCustomer: null as Customer | null,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        activeCustomers: (state) => state.customers.filter(c => c.status === 'active'),
        totalCustomers: (state) => state.customers.length,
    },
    actions: {
        async fetchCustomers() {
            this.loading = true;
            try {
                this.customers = await customerService.getAll();
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch customers';
            } finally {
                this.loading = false;
            }
        },
        async fetchCustomerById(id: string) {
            this.loading = true;
            try {
                const customer = await customerService.getById(id);
                if (customer) {
                    this.currentCustomer = customer;
                } else {
                    this.error = 'Customer not found';
                }
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch customer';
            } finally {
                this.loading = false;
            }
        },
        async addCustomer(customer: Omit<Customer, 'id'>) {
            this.loading = true;
            try {
                const newCustomer = await customerService.create(customer);
                this.customers.push(newCustomer);
            } catch (err: any) {
                this.error = err.message || 'Failed to create customer';
            } finally {
                this.loading = false;
            }
        }
    }
});
