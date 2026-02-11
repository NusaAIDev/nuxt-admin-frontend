import { BaseService } from './base.service';
import type { Conversation, Message } from '~/types';
import inboxData from '~/data/inbox.json';

class InboxService extends BaseService<Conversation> {
    async getByCustomerId(customerId: string): Promise<Conversation[]> {
        const rawData = await this.getFromJSON(inboxData);
        // Filter by customer_id
        // Note: In a real API, this would be /customers/:id/inbox
        return rawData.filter(c => c.customer_id === customerId);
    }

    async getConversationById(id: string): Promise<Conversation | undefined> {
        const rawData = await this.getFromJSON(inboxData);
        return rawData.find(c => c.id === id);
    }

    // Simulate sending a message (just updates local state in memory if we had it, but here just returns success)
    async sendMessage(conversationId: string, text: string): Promise<Message> {
        await this.simulateDelay();
        return {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'bot', // Admin acting as bot
            text,
            timestamp: new Date().toISOString()
        };
    }
}

export const inboxService = new InboxService();
