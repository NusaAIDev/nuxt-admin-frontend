import { BaseService } from './base.service';
import type { Customer, CustomerContact } from '~/types';
import customersData from '~/data/customers.json';

class CustomerService extends BaseService<Customer> {
    private toWorkspace(row: Customer): Customer {
        const primaryContact: CustomerContact = {
            id: row.primaryContact?.id || `contact_${row.id}`,
            name: row.primaryContact?.name || row.name,
            email: row.primaryContact?.email || row.email,
            phone: row.primaryContact?.phone || row.phone,
            role: row.primaryContact?.role || row.role,
            address: row.primaryContact?.address || row.address,
            notes: row.primaryContact?.notes || row.notes,
        };

        return {
            ...row,
            primaryContact,
            // Keep flattened fields for current UI bindings.
            name: primaryContact.name,
            email: primaryContact.email,
            phone: primaryContact.phone,
            role: primaryContact.role,
            address: primaryContact.address,
            notes: primaryContact.notes,
            primaryContactId: row.primaryContactId || primaryContact.id,
        };
    }

    async getAll(): Promise<Customer[]> {
        const rows = await this.getFromJSON(customersData);
        return rows.map((row) => this.toWorkspace(row as Customer));
    }

    async getById(id: string): Promise<Customer | undefined> {
        const customers = await this.getAll();
        return customers.find(c => c.id === id);
    }

    async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
        await this.simulateDelay();
        const created = {
            ...customer,
            id: Math.random().toString(36).substr(2, 9)
        } as Customer;
        // In a real app, this would POST to API.
        // Here we just return the object as if created.
        return this.toWorkspace(created);
    }
}

export const customerService = new CustomerService();
