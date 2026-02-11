import { defineStore } from 'pinia';
import { inboxService } from '~/services/inbox.service';
import type { Conversation, Message } from '~/types';

export const useInboxStore = defineStore('inbox', {
    state: () => ({
        conversations: [] as Conversation[],
        currentConversation: null as Conversation | null,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchConversationsResult(customerId: string) {
            this.loading = true;
            try {
                this.conversations = await inboxService.getByCustomerId(customerId);
            } catch (err: any) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },
        selectConversation(conversation: Conversation) {
            this.currentConversation = conversation;
        },
        async sendMessage(text: string) {
            if (!this.currentConversation) return;

            try {
                const msg = await inboxService.sendMessage(this.currentConversation.id, text);
                this.currentConversation.messages.push(msg);
            } catch (err: any) {
                this.error = err.message;
            }
        }
    }
});
