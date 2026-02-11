import { defineStore } from 'pinia';
import { datasetService } from '~/services/dataset.service';
import type { KnowledgeItem } from '~/types';

export const useDatasetStore = defineStore('dataset', {
    state: () => ({
        knowledgeItems: [] as KnowledgeItem[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchKnowledgeByCustomer(customerId: string) {
            this.loading = true;
            try {
                this.knowledgeItems = await datasetService.getByCustomerId(customerId);
            } catch (err: any) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },
        async addKnowledge(item: Omit<KnowledgeItem, 'id' | 'created_at'>) {
            this.loading = true;
            try {
                const newItem = await datasetService.create(item);
                this.knowledgeItems.push(newItem);
            } catch (err: any) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        }
    }
});
