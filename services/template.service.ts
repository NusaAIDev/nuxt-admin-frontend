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

    async create(customerId: string, templateData: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> {
        // Mock creation delay
        await this.simulateDelay(1000);

        const newTemplate: WhatsAppTemplate = {
            id: `temp_${Math.random().toString(36).substr(2, 9)}`,
            customerId,
            name: templateData.name || 'New Template',
            status: 'pending',
            category: (templateData.category as any) || 'MARKETING',
            language: templateData.language || 'en_US',
            lastSynced: new Date().toISOString(),
            components: templateData.components || [],
            usageCount: 0,
            lastUsed: null,
        };

        return newTemplate;
    }
}

export const templateService = new TemplateService();
