import { BaseService } from './base.service';
import type { WhatsAppTemplate } from '~/types';
import templatesData from '~/data/templates.json';

class TemplateService extends BaseService<WhatsAppTemplate> {
    async getAllByCustomerId(customerId: string): Promise<WhatsAppTemplate[]> {
        const templates = await this.getFromJSON(templatesData);
        return templates.filter(t => t.customerId === customerId);
    }

    async getById(id: string): Promise<WhatsAppTemplate | undefined> {
        const templates = await this.getFromJSON(templatesData);
        return templates.find(t => t.id === id);
    }

    async syncFromWhatsApp(customerId: string): Promise<WhatsAppTemplate[]> {
        // Mock sync delay
        await this.simulateDelay(1500);

        // In reality, this would fetch from WhatsApp API and update local DB
        const templates = await this.getAllByCustomerId(customerId);

        // Return updated list with fresh timestamps (simulated)
        return templates.map(t => ({
            ...t,
            lastSynced: new Date().toISOString()
        }));
    }

    async sendTest(customerId: string, templateName: string, phoneNumber: string, params: Record<string, string>): Promise<boolean> {
        // Mock send delay
        await this.simulateDelay(1000);

        console.log(`Sending template ${templateName} to ${phoneNumber} with params:`, params);

        // Simulate success
        return true;
    }
}

export const templateService = new TemplateService();
