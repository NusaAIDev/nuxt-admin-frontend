import { BaseService } from './base.service';
import type { KnowledgeItem } from '~/types';
import datasetData from '~/data/dataset.json';

class DatasetService extends BaseService<KnowledgeItem> {
    async getByCustomerId(customerId: string): Promise<KnowledgeItem[]> {
        const rawData = await this.getFromJSON(datasetData);
        return rawData.filter(item => item.customer_id === customerId);
    }

    async create(item: Omit<KnowledgeItem, 'id' | 'created_at'>): Promise<KnowledgeItem> {
        await this.simulateDelay();
        return {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString()
        };
    }

    async delete(id: string): Promise<void> {
        await this.simulateDelay();
        // Logic to delete would be here in real API
    }
}

export const datasetService = new DatasetService();
