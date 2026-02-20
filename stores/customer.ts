import { defineStore } from 'pinia';
import { customerService } from '~/services/customer.service';
import type { Customer } from '~/types';

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customers: [] as Customer[],
        currentCustomer: null as Customer | null,
        selectedCustomerId: null as string | null,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        activeCustomers: (state) => state.customers.filter(c => c.status === 'active'),
        totalCustomers: (state) => state.customers.length,
        selectedCustomer: (state) => state.currentCustomer,
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
            if (this.currentCustomer?.id === id) return;

            this.loading = true;
            try {
                const customer = await customerService.getById(id);
                if (customer) {
                    this.currentCustomer = customer;
                    this.selectedCustomerId = id;
                } else {
                    this.error = 'Customer not found';
                }
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch customer';
            } finally {
                this.loading = false;
            }
        },
        async selectCustomer(id: string | null) {
            this.selectedCustomerId = id;
            if (id) {
                await this.fetchCustomerById(id);
            } else {
                this.currentCustomer = null;
            }
        },
        async addCustomer(customer: Omit<Customer, 'id'>) {
            this.loading = true;
            try {
                const newCustomer = await customerService.create(customer);
                this.customers.push(newCustomer);
                return newCustomer;
            } catch (err: any) {
                this.error = err.message || 'Failed to create customer';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
