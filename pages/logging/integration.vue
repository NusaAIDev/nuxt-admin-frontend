<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4 d-flex justify-content-between align-items-end">
      <div>
        <h2 class="fw-bold text-dark mb-1">Integration Logs</h2>
        <p class="text-secondary mb-0">Track communication between internal services and external AI providers.</p>
      </div>
    </div>

    <!-- Summary Cards -->
    <LogSummaryCards :cards="summaryData" />

    <!-- Filters -->
    <LogFilters 
      :refreshing="refreshing" 
      @change="handleFilterChange" 
      @refresh="fetchLogs" 
      @export="handleExport" 
    />

    <!-- Table -->
    <LogTable :logs="filteredLogs" @view-detail="showLogDetail" />

    <!-- Detail Drawer -->
    <LogDetailDrawer 
      :is-open="isDrawerOpen" 
      :log="selectedLog" 
      @close="isDrawerOpen = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useHead } from '#imports';
import LogSummaryCards from '~/components/logging/LogSummaryCards.vue';
import LogFilters from '~/components/logging/LogFilters.vue';
import LogTable from '~/components/logging/LogTable.vue';
import LogDetailDrawer from '~/components/logging/LogDetailDrawer.vue';

interface LogEntry {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
  resource: string;
  message?: string;
  status: 'success' | 'warning' | 'error';
  ip: string;
  type: 'activity' | 'integration' | 'security';
  metadata?: any;
}

const refreshing = ref(false);
const isDrawerOpen = ref(false);
const selectedLog = ref<LogEntry | null>(null);

const filters = reactive({
  query: '',
  status: '',
});

// Integration Specific Mock Data
const logs = ref<LogEntry[]>([
  { id: "log_int_001", timestamp: new Date().toISOString(), actor: "OpenAI Service", event: "Chat Completion Request", resource: "gpt-4-turbo", message: "Successful request to OpenAI API", status: "success", ip: "api.openai.com", type: 'integration', metadata: { tokens: 452, latency: "1.2s" } },
  { id: "log_int_004", timestamp: new Date(Date.now() - 10800000).toISOString(), actor: "Google Gemini", event: "Authentication Error", resource: "Gemini Pro", message: "Invalid API key provided for Google Gemini", status: "error", ip: "google.api.com", type: 'integration', metadata: { error: "invalid_api_key", code: 401 } },
  { id: "log_int_005", timestamp: new Date(Date.now() - 14400000).toISOString(), actor: "Meta API", event: "Webhook Delivery", resource: "WhatsApp Cloud", message: "Inbound message received and acknowledged", status: "success", ip: "graph.facebook.com", type: 'integration' },
]);

const summaryData = [
  { label: 'Total Requests', value: 8540, icon: 'bi bi-lightning-charge', bgClass: 'bg-primary-subtle', textClass: 'text-primary' },
  { label: 'Successful', value: 8420, icon: 'bi bi-cloud-check', bgClass: 'bg-success-subtle', textClass: 'text-success' },
  { label: 'API Throttling', value: 98, icon: 'bi bi-hourglass-split', bgClass: 'bg-warning-subtle', textClass: 'text-warning' },
  { label: 'Failed Calls', value: 22, icon: 'bi bi-cloud-slash', bgClass: 'bg-danger-subtle', textClass: 'text-danger' },
];

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesQuery = !filters.query || 
      log.event.toLowerCase().includes(filters.query.toLowerCase()) ||
      log.message?.toLowerCase().includes(filters.query.toLowerCase()) ||
      log.resource.toLowerCase().includes(filters.query.toLowerCase());
    
    const matchesStatus = !filters.status || log.status === filters.status;
    return matchesQuery && matchesStatus;
  });
});

const handleFilterChange = (newFilters: any) => {
  filters.query = newFilters.query;
  filters.status = newFilters.status;
};

const fetchLogs = () => {
  refreshing.value = true;
  setTimeout(() => (refreshing.value = false), 800);
};

const handleExport = () => alert('Exporting integration logs...');

const showLogDetail = (log: LogEntry) => {
  selectedLog.value = log;
  isDrawerOpen.value = true;
};

useHead({ title: 'Integration Logs | AI Admin' });
</script>
