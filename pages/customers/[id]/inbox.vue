<template>
  <div class="d-flex flex-column h-100">
    <!-- 3-Panel Layout -->
    <div class="d-flex flex-grow-1 overflow-hidden bg-white border rounded-3 inbox-shell">
      <!-- Left Panel: Conversation List -->
      <div class="d-flex flex-column border-end history-panel">
        <div class="p-3 border-bottom bg-light">
          <h6 class="mb-0 fw-bold">Conversations</h6>
        </div>
        <div class="flex-grow-1 overflow-y-auto custom-scrollbar scroll-panel">
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
        
        <div class="flex-grow-1 p-3 overflow-y-auto custom-scrollbar scroll-panel chat-panel" style="background-color: #f9fafb;">
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

        <div v-if="selectedConversation && selectedConversation.mode === 'HUMAN'" class="p-3 border-top bg-white">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Type a message..." v-model="newMessage">
            <button class="btn btn-primary">
              <i class="bi bi-send"></i>
            </button>
          </div>
        </div>
        <div
          v-else-if="selectedConversation && selectedConversation.mode === 'AI'"
          class="p-3 border-top bg-light"
        >
          <div class="small text-secondary d-flex align-items-center gap-2">
            <i class="bi bi-robot"></i>
            AI mode is read-only. Switch to HUMAN mode to reply manually.
          </div>
        </div>
      </div>

      <!-- Right Panel: Info Panel -->
      <div class="d-flex flex-column border-start bg-light-subtle info-panel">
        <div v-if="selectedConversation" class="p-4">
          <h6 class="fw-bold mb-3 text-uppercase small text-muted">Conversation Info</h6>

          <div class="info-card p-3 mb-3">
            <div class="text-secondary extra-small fw-semibold mb-1">CONTACT</div>
            <div class="fw-bold">{{ selectedConversation.customerWaId }}</div>
            <div class="d-flex align-items-center gap-2 mt-2">
              <span class="badge rounded-pill bg-success-subtle text-success">Active</span>
              <span class="badge rounded-pill bg-light text-secondary border">{{ formatTime(selectedConversation.lastActivityTime) }}</span>
            </div>
          </div>

          <div class="info-card p-3 mb-3">
            <label class="form-label small text-secondary fw-semibold mb-2">MODE</label>
            <div class="mode-switch" role="group" aria-label="Conversation mode">
              <button 
                :class="['mode-btn', { active: selectedConversation.mode === 'AI' }]"
                :disabled="selectedConversation.mode === 'HUMAN'"
              >
                <i class="bi bi-robot me-1"></i>AI
              </button>
              <button 
                :class="['mode-btn', { active: selectedConversation.mode === 'HUMAN' }]"
                @click="openSwitchModal(selectedConversation)"
              >
                <i class="bi bi-person me-1"></i>HUMAN
              </button>
            </div>
            <div class="small text-secondary mt-2">
              <template v-if="selectedConversation.mode === 'AI'">
                Click <span class="fw-semibold">HUMAN</span> to take over this chat manually.
              </template>
              <template v-else>
                Human mode active. This conversation is locked and cannot switch back to AI.
              </template>
            </div>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-6">
              <div class="info-card p-3 h-100">
                <div class="text-secondary extra-small fw-semibold mb-1">MESSAGES</div>
                <div class="h5 fw-bold mb-0">{{ selectedConversation.messages.length }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="info-card p-3 h-100">
                <div class="text-secondary extra-small fw-semibold mb-1">UNREAD</div>
                <div class="h5 fw-bold mb-0">{{ selectedConversation.unreadCount }}</div>
              </div>
            </div>
          </div>

          <div class="info-card p-3 mb-0" v-if="selectedConversation.aiConfidenceScore">
            <label class="form-label small text-secondary fw-semibold mb-2">AI CONFIDENCE</label>
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="h5 fw-bold mb-0 text-dark">{{ (selectedConversation.aiConfidenceScore * 100).toFixed(0) }}%</span>
              <span class="badge bg-success-subtle text-success">Healthy</span>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar bg-success" :style="{ width: (selectedConversation.aiConfidenceScore * 100) + '%' }"></div>
            </div>
          </div>
        </div>
        <div v-else class="h-100 d-flex align-items-center justify-content-center text-muted p-3 text-center">
          <p class="small">Select a conversation to view details</p>
        </div>
      </div>
    </div>

    <div v-if="showSwitchModal" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <div class="modal-content-custom">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="fw-bold mb-0">Konfirmasi Switch Mode</h6>
            <button type="button" class="btn-close shadow-none" @click="closeSwitchModal"></button>
          </div>
          <p class="text-secondary small mb-4">
            Apakah Anda yakin ingin mengubah mode percakapan ke <span class="fw-semibold text-dark">HUMAN</span>?
            Setelah diubah, mode ini tidak bisa kembali ke AI.
          </p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-light border" @click="closeSwitchModal">Batal</button>
            <button class="btn btn-warning text-dark fw-semibold" @click="confirmSwitchToHuman">
              Ya, Switch ke HUMAN
            </button>
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
const showSwitchModal = ref(false);
const pendingSwitchConversation = ref<Conversation | null>(null);

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

function openSwitchModal(conversation: Conversation) {
  if (conversation.mode === 'HUMAN') {
    return;
  }
  pendingSwitchConversation.value = conversation;
  showSwitchModal.value = true;
}

function closeSwitchModal() {
  showSwitchModal.value = false;
  pendingSwitchConversation.value = null;
}

function confirmSwitchToHuman() {
  if (!pendingSwitchConversation.value) {
    return;
  }
  const conversation = pendingSwitchConversation.value;
  conversation.mode = 'HUMAN';
  closeSwitchModal();
}

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
.inbox-shell {
  min-height: calc(100vh - 190px);
}

.history-panel {
  width: 300px;
  flex-shrink: 0;
}

.info-panel {
  width: 260px;
  flex-shrink: 0;
}

.chat-panel {
  min-width: 0;
}

.extra-small {
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

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

.info-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.mode-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.mode-btn {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  background: #fff;
  color: #475569;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.55rem 0.5rem;
  transition: all 0.15s ease;
}

.mode-btn:hover {
  border-color: #6366f1;
  color: #3730a3;
}

.mode-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.mode-btn.active {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.25);
}

.scroll-panel::-webkit-scrollbar {
  width: 8px;
}

.scroll-panel::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-panel::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 99px;
}

.scroll-panel::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 1200px) {
  .history-panel {
    width: 280px;
  }

  .info-panel {
    width: 240px;
  }
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1080;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 520px;
  padding: 1rem;
}

.modal-content-custom {
  background: #fff;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  padding: 1rem 1rem 1.1rem;
}
</style>
