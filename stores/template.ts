import { defineStore } from 'pinia';
import { templateService } from '~/services/template.service';
import type { WhatsAppTemplate } from '~/types';

export const useTemplateStore = defineStore('template', {
    state: () => ({
        templates: [] as WhatsAppTemplate[],
        currentTemplate: null as WhatsAppTemplate | null,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchTemplates(customerId: string) {
            this.loading = true;
            try {
                this.templates = await templateService.getAllByCustomerId(customerId);
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch templates';
            } finally {
                this.loading = false;
            }
        },
        async fetchTemplateById(id: string) {
            this.loading = true;
            try {
                const template = await templateService.getById(id);
                if (template) {
                    this.currentTemplate = template;
                } else {
                    this.error = 'Template not found';
                }
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch template';
            } finally {
                this.loading = false;
            }
        },
        async syncTemplates(customerId: string) {
            this.loading = true;
            try {
                this.templates = await templateService.syncFromWhatsApp(customerId);
            } catch (err: any) {
                this.error = err.message || 'Failed to sync templates';
            } finally {
                this.loading = false;
            }
        },
        async sendTestTemplate(customerId: string, templateName: string, phoneNumber: string, params: Record<string, string>) {
            this.loading = true;
            try {
                return await templateService.sendTest(customerId, templateName, phoneNumber, params);
            } catch (err: any) {
                this.error = err.message || 'Failed to send test template';
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});
