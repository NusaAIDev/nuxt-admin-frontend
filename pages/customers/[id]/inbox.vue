<template>
  <div>
    <!-- 3-Panel Layout -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="row g-0" style="height: 600px;">
          <!-- Left Panel: Conversation List -->
          <div class="col-md-3 border-end">
            <div class="p-3 border-bottom bg-light">
              <h6 class="mb-0 fw-bold">Conversations</h6>
            </div>
            <div class="conversation-list" style="height: calc(100% - 60px); overflow-y: auto;">
              <div 
                v-for="conv in conversations" 
                :key="conv.id"
                @click="selectedConversation = conv"
                :class="['conversation-item p-3 border-bottom', { 'active': selectedConversation?.id === conv.id }]"
                style="cursor: pointer;"
              >
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <span class="fw-medium">{{ conv.customerWaId }}</span>
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
          <div class="col-md-6 d-flex flex-column">
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
            
            <div class="flex-grow-1 p-3" style="overflow-y: auto; background-color: #f9fafb;">
              <div v-if="!selectedConversation" class="text-center text-muted py-5">
                <i class="bi bi-chat-dots fs-1"></i>
                <p class="mt-2">Select a conversation to view messages</p>
              </div>
              
              <div v-else>
                <div v-for="msg in selectedConversation.messages" :key="msg.id" class="mb-3">
                  <div :class="['d-flex', msg.sender === 'outbound' ? 'justify-content-end' : 'justify-content-start']">
                    <div :class="[
                      'message-bubble p-3 rounded',
                      msg.sender === 'outbound' ? 'bg-primary text-white' : 'bg-white border'
                    ]" style="max-width: 70%;">
                      <p class="mb-1">{{ msg.text }}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <small :class="msg.sender === 'outbound' ? 'text-white-50' : 'text-muted'">
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

            <div v-if="selectedConversation" class="p-3 border-top">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Type a message..." v-model="newMessage">
                <button class="btn btn-primary">
                  <i class="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Panel: Info Panel -->
          <div class="col-md-3 border-start">
            <div v-if="selectedConversation" class="p-3">
              <h6 class="fw-bold mb-3">Conversation Info</h6>
              
              <div class="mb-3">
                <label class="form-label small text-muted">Mode</label>
                <div class="btn-group w-100" role="group">
                  <button 
                    :class="['btn', selectedConversation.mode === 'AI' ? 'btn-primary' : 'btn-outline-primary']"
                    @click="selectedConversation.mode = 'AI'"
                  >
                    <i class="bi bi-robot me-1"></i>AI
                  </button>
                  <button 
                    :class="['btn', selectedConversation.mode === 'HUMAN' ? 'btn-warning' : 'btn-outline-warning']"
                    @click="selectedConversation.mode = 'HUMAN'"
                  >
                    <i class="bi bi-person me-1"></i>HUMAN
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small text-muted">Message Count</label>
                <div class="fw-bold">{{ selectedConversation.messages.length }}</div>
              </div>

              <div class="mb-3" v-if="selectedConversation.aiConfidenceScore">
                <label class="form-label small text-muted">AI Confidence</label>
                <div class="fw-bold">{{ (selectedConversation.aiConfidenceScore * 100).toFixed(1) }}%</div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar" :style="{ width: (selectedConversation.aiConfidenceScore * 100) + '%' }"></div>
                </div>
              </div>

              <button class="btn btn-outline-danger w-100">
                <i class="bi bi-x-circle me-2"></i>Close Conversation
              </button>
            </div>
            <div v-else class="p-3 text-center text-muted">
              <p class="small">Select a conversation to view details</p>
            </div>
          </div>
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
