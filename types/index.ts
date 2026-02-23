// Person responsible from client side (future `customers` table).
export interface CustomerContact {
    id: string;
    name: string;
    email: string;
    phone: string;
    role?: string;
    address?: string;
    notes?: string;
}

// Tenant/workspace entity (future `organizations` table).
export interface Organization {
    id: string;
    businessName: string;
    whatsappNumber: string;
    status: 'active' | 'suspended';
    aiModeDefault: boolean;
    messagesThisMonth: number;
    createdDate: string;
    avatar: string;
    systemInstruction: string;
    industry?: string;
    country?: string;
    timezone?: string;
    website?: string;
    metaBusinessId?: string;
    businessCategory?: string;
    primaryContactId?: string;
    integrations?: WhatsAppIntegration[];
}

// Transitional view model used by current UI/API mocks (denormalized join).
export interface OrganizationWorkspace extends Organization {
    // Embedded relation
    primaryContact?: CustomerContact;
    // Legacy flattened fields kept for backward compatibility in pages/components.
    name: string;
    email: string;
    phone: string;
    role?: string;
    address?: string;
    notes?: string;
}

// Backward-compatible alias used across current codebase.
export type Customer = OrganizationWorkspace;

// WhatsApp Integration
export interface WhatsAppIntegration {
    id: string;
    customerId: string;
    name: string;
    whatsappNumber: string;
    phoneNumberId: string;
    businessAccountId: string;
    metaBusinessId?: string;
    businessCategory?: string;
    accessToken: string;
    webhookVerifyToken: string;
    status: 'connected' | 'disconnected';
    lastWebhookEventTime: string | null;
}

// WhatsApp Template
export interface WhatsAppTemplate {
    id: string;
    customerId: string;
    name: string;
    status: 'approved' | 'pending' | 'rejected';
    category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
    language: string;
    lastSynced: string;
    components: TemplateComponent[];
    usageCount: number;
    lastUsed: string | null;
}

export interface TemplateComponent {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
    buttons?: any[];
}

// Knowledge Base
export interface KnowledgeDocument {
    id: string;
    customerId: string;
    filename: string;
    size: number;
    totalChunks: number;
    status: 'processing' | 'ready' | 'failed';
    uploadDate: string;
    type: 'pdf' | 'txt';
}

// Messages & Conversations
export interface Message {
    id: string;
    conversationId: string;
    sender: 'inbound' | 'outbound';
    text: string;
    timestamp: string;
    aiGenerated: boolean;
}

export interface Conversation {
    id: string;
    customerId: string;
    customerWaId: string;
    lastMessage: string;
    mode: 'AI' | 'HUMAN';
    unreadCount: number;
    lastActivityTime: string;
    messages: Message[];
    aiConfidenceScore?: number;
}

// Usage & Metrics
export interface UsageMetrics {
    customerId: string;
    month: string;
    totalMessages: number;
    totalAiRequests: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedOpenAiCost: number;
    totalWaConversations: number;
    estimatedWaCost: number;
    dailyBreakdown?: DailyUsage[];
}

export interface DailyUsage {
    date: string;
    messages: number;
    aiRequests: number;
    tokens: number;
}

// Logs
export interface WebhookLog {
    id: string;
    timestamp: string;
    customerId: string;
    customerName: string;
    eventType: string;
    status: 'success' | 'error';
    error?: string;
}

export interface AiLog {
    id: string;
    timestamp: string;
    customerId: string;
    customerName: string;
    modelUsed: string;
    tokens: number;
    latency: number;
    error?: string;
}

export interface SystemLog {
    id: string;
    timestamp: string;
    type: 'embedding_failure' | 'background_job_error' | 'delivery_failure';
    message: string;
    details?: string;
}

// Dashboard Metrics
export interface DashboardMetrics {
    totalCustomers: number;
    totalWaConnected: number;
    totalActiveConversations: number;
    totalMessagesToday: number;
    aiVsHumanRatio: {
        ai: number;
        human: number;
    };
    messageVolume7Days: {
        date: string;
        count: number;
    }[];
    systemStatus: {
        webhookStatus: 'ok' | 'error';
        aiApiStatus: 'ok' | 'error';
        failedMessagesCount: number;
    };
}
