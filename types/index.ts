export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    avatar: string;
    system_instruction: string;
}

export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

export interface Conversation {
    id: string;
    customer_id: string;
    contact_name: string;
    contact_number: string;
    last_message: string;
    last_message_at: string;
    unread_count: number;
    messages: Message[];
}

export interface KnowledgeItem {
    id: string;
    customer_id: string;
    type: 'text' | 'pdf' | 'url';
    content: string;
    status: 'trained' | 'processing' | 'failed';
    created_at: string;
}
