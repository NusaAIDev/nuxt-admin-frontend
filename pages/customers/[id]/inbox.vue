<template>
  <div class="d-flex flex-column h-100">
    <!-- 3-Panel Layout -->
    <div class="d-flex flex-grow-1 overflow-hidden bg-white border rounded-3">
      <!-- Left Panel: Conversation List -->
      <div class="d-flex flex-column border-end" style="width: 320px; flex-shrink: 0;">
        <div class="p-3 border-bottom bg-light">
          <h6 class="mb-0 fw-bold">Conversations</h6>
        </div>
        <div class="flex-grow-1 overflow-y-auto custom-scrollbar">
          <div 
            v-for="conv in conversations" 
            :key="conv.id"
            @click="selectedConversation = conv"
            :class="['conversation-item p-3 border-bottom', { 'active': selectedConversation?.id === conv.id }]"
            style="cursor: pointer;"
          >
            <div class="d-flex justify-content-between align-items-start mb-1">
              <span class="fw-medium text-truncate" style="max-width: 120px;">{{ conv.customerWaId }}</span>
              <span :class="{
                'badge bg-primary-subtle text-primary': conv.mode === 'AI',
                'badge bg-warning-subtle text-warning': conv.mode === 'HUMAN'
              }" style="font-size: 0.7rem;">
                {{ conv.mode }}
              </span>
            </div>
            <p class="text-muted small mb-1 text-truncate">{{ conv.lastMessage }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted" style="font-size: 0.7rem;">{{ formatTime(conv.lastActivityTime) }}</span>
              <span v-if="conv.unreadCount > 0" class="badge bg-danger rounded-pill">{{ conv.unreadCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Panel: Chat Window -->
      <div class="d-flex flex-column flex-grow-1 min-width-0">
        <div v-if="selectedConversation" class="p-3 border-bottom bg-light">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-0 fw-bold">{{ selectedConversation.customerWaId }}</h6>
              <small class="text-muted">{{ selectedConversation.messages.length }} messages</small>
            </div>
            <span :class="{
              'badge bg-primary': selectedConversation.mode === 'AI',
              'badge bg-warning': selectedConversation.mode === 'HUMAN'
            }">
              {{ selectedConversation.mode }} Mode
            </span>
          </div>
        </div>
        
        <div class="flex-grow-1 p-3 overflow-y-auto custom-scrollbar" style="background-color: #f9fafb;">
          <div v-if="!selectedConversation" class="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
            <i class="bi bi-chat-dots fs-1 mb-3 opacity-50"></i>
            <p>Select a conversation to view messages</p>
          </div>
          
          <div v-else>
            <div v-for="msg in selectedConversation.messages" :key="msg.id" class="mb-3">
              <div :class="['d-flex', msg.sender === 'outbound' ? 'justify-content-end' : 'justify-content-start']">
                <div :class="[
                  'message-bubble p-3 rounded-3 shadow-sm',
                  msg.sender === 'outbound' ? 'bg-primary text-white' : 'bg-white border'
                ]" style="max-width: 70%;">
                  <p class="mb-1">{{ msg.text }}</p>
                  <div class="d-flex justify-content-between align-items-center gap-3">
                    <small :class="msg.sender === 'outbound' ? 'text-white-50' : 'text-muted'" style="font-size: 0.7rem;">
                      {{ formatTime(msg.timestamp) }}
                    </small>
                    <small v-if="msg.aiGenerated" :class="msg.sender === 'outbound' ? 'text-white-50' : 'text-muted'">
                      <i class="bi bi-robot"></i> AI
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedConversation" class="p-3 border-top bg-white">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Type a message..." v-model="newMessage">
            <button class="btn btn-primary">
              <i class="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel: Info Panel -->
      <div class="d-flex flex-column border-start bg-white" style="width: 280px; flex-shrink: 0;">
        <div v-if="selectedConversation" class="p-4">
          <h6 class="fw-bold mb-4 text-uppercase small text-muted">Conversation Info</h6>
          
          <div class="mb-4">
            <label class="form-label small text-secondary fw-semibold">MODE</label>
            <div class="btn-group w-100" role="group">
              <button 
                :class="['btn btn-sm', selectedConversation.mode === 'AI' ? 'btn-primary' : 'btn-outline-primary']"
                @click="selectedConversation.mode = 'AI'"
              >
                <i class="bi bi-robot me-1"></i>AI
              </button>
              <button 
                :class="['btn btn-sm', selectedConversation.mode === 'HUMAN' ? 'btn-warning' : 'btn-outline-warning']"
                @click="selectedConversation.mode = 'HUMAN'"
              >
                <i class="bi bi-person me-1"></i>HUMAN
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small text-secondary fw-semibold">MESSAGE COUNT</label>
            <div class="fw-bold">{{ selectedConversation.messages.length }}</div>
          </div>

          <div class="mb-4" v-if="selectedConversation.aiConfidenceScore">
            <label class="form-label small text-secondary fw-semibold">AI CONFIDENCE</label>
            <div class="d-flex align-items-center justify-content-between mb-1">
                 <span class="h5 fw-bold mb-0 text-dark">{{ (selectedConversation.aiConfidenceScore * 100).toFixed(0) }}%</span>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar bg-success" :style="{ width: (selectedConversation.aiConfidenceScore * 100) + '%' }"></div>
            </div>
          </div>

          <button class="btn btn-outline-danger w-100 mt-2">
            <i class="bi bi-x-circle me-2"></i>Close Ticket
          </button>
        </div>
        <div v-else class="h-100 d-flex align-items-center justify-content-center text-muted p-3 text-center">
          <p class="small">Select a conversation to view details</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';
import type { Conversation } from '~/types';

const customerStore = useCustomerStore();
const route = useRoute();
const selectedConversation = ref<Conversation | null>(null);
const newMessage = ref('');

// Mock conversations data
const conversations = ref<Conversation[]>([
  {
    id: '1',
    customerId: route.params.id as string,
    customerWaId: '+62812345678',
    lastMessage: 'What are your business hours?',
    mode: 'AI',
    unreadCount: 2,
    lastActivityTime: '2024-02-13T20:45:00',
    aiConfidenceScore: 0.95,
    messages: [
      { id: 'm1', conversationId: '1', sender: 'inbound', text: 'Hello!', timestamp: '2024-02-13T20:40:00', aiGenerated: false },
      { id: 'm2', conversationId: '1', sender: 'outbound', text: 'Hi! How can I help you today?', timestamp: '2024-02-13T20:40:05', aiGenerated: true },
      { id: 'm3', conversationId: '1', sender: 'inbound', text: 'What are your business hours?', timestamp: '2024-02-13T20:45:00', aiGenerated: false }
    ]
  },
  {
    id: '2',
    customerId: route.params.id as string,
    customerWaId: '+62898765432',
    lastMessage: 'I need help with my order',
    mode: 'HUMAN',
    unreadCount: 0,
    lastActivityTime: '2024-02-13T19:30:00',
    messages: [
      { id: 'm4', conversationId: '2', sender: 'inbound', text: 'I need help with my order', timestamp: '2024-02-13T19:30:00', aiGenerated: false }
    ]
  }
]);

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

useHead({
  title: 'Inbox - AI Admin'
});

onMounted(() => {
  if (!customerStore.currentCustomer) {
    customerStore.fetchCustomerById(route.params.id as string);
  }
});
</script>

<style scoped>
.conversation-item:hover {
  background-color: #f9fafb;
}

.conversation-item.active {
  background-color: #eef2ff;
  border-left: 3px solid #4F46E5;
}

.message-bubble {
  word-wrap: break-word;
}
</style>
