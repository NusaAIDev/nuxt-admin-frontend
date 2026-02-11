<template>
  <div class="row">
    <div class="col-md-4 border-end">
        <h5>Conversations</h5>
        <div class="list-group">
            <button 
                v-for="conv in inboxStore.conversations" 
                :key="conv.id"
                class="list-group-item list-group-item-action"
                :class="{ active: inboxStore.currentConversation?.id === conv.id }"
                @click="inboxStore.selectConversation(conv)"
            >
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ conv.contact_name }}</h6>
                    <small>{{ new Date(conv.last_message_at).toLocaleDateString() }}</small>
                </div>
                <p class="mb-1 text-truncate">{{ conv.last_message }}</p>
                <small v-if="conv.unread_count > 0" class="badge bg-danger rounded-pill">{{ conv.unread_count }}</small>
            </button>
        </div>
    </div>
    
    <div class="col-md-8">
        <div v-if="inboxStore.currentConversation">
            <div class="chat-header d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                 <h5>{{ inboxStore.currentConversation.contact_name }} ({{ inboxStore.currentConversation.contact_number }})</h5>
            </div>
            
            <div class="chat-history mb-3" style="height: 400px; overflow-y: auto;">
                <div 
                    v-for="msg in inboxStore.currentConversation.messages" 
                    :key="msg.id"
                    class="d-flex mb-2"
                    :class="msg.sender === 'user' ? 'justify-content-start' : 'justify-content-end'"
                >
                    <div class="card p-2" :class="msg.sender === 'user' ? 'bg-light text-dark' : 'bg-primary text-white'">
                        <div>{{ msg.text }}</div>
                        <small class="text-white-50" v-if="msg.sender === 'bot'">{{ new Date(msg.timestamp).toLocaleTimeString() }}</small>
                        <small class="text-muted" v-else>{{ new Date(msg.timestamp).toLocaleTimeString() }}</small>
                    </div>
                </div>
            </div>

            <div class="input-group">
                <input type="text" class="form-control" placeholder="Type a message..." disabled>
                <button class="btn btn-primary" disabled>Read Only</button>
            </div>
             <small class="text-muted">Inbox is read-only in this MVP.</small>
        </div>
        <div v-else class="text-center mt-5 text-muted">
             <i class="bi bi-chat-square-text fs-1"></i>
             <p>Select a conversation to view messages.</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInboxStore } from '~/stores/inbox';

const route = useRoute();
const inboxStore = useInboxStore();

onMounted(() => {
    inboxStore.fetchConversationsResult(route.params.id as string);
});
</script>
