import { BaseService } from './base.service';
import type { Customer } from '~/types';
import customersData from '~/data/customers.json';

class CustomerService extends BaseService<Customer> {
    async getAll(): Promise<Customer[]> {
        return this.getFromJSON(customersData);
    }

    async getById(id: string): Promise<Customer | undefined> {
        const customers = await this.getAll();
        return customers.find(c => c.id === id);
    }

    async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
        await this.simulateDelay();
        const newCustomer = {
            ...customer,
            id: Math.random().toString(36).substr(2, 9)
        } as Customer;
        // In a real app, this would POST to API.
        // Here we just return the object as if created.
        return newCustomer;
    }
}

export const customerService = new CustomerService();
