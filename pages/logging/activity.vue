<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4 d-flex justify-content-between align-items-end">
      <div>
        <h2 class="fw-bold text-dark mb-1">Activity Logs</h2>
        <p class="text-secondary mb-0">Monitor administrative actions and system-wide modifications.</p>
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

// Activity Specific Mock Data
const logs = ref<LogEntry[]>([
  { id: "log_act_001", timestamp: new Date().toISOString(), actor: "Admin User", event: "Updated API Key Status", resource: "OpenAI Main Prod", message: "API key status changed from inactive to active", status: "success", ip: "192.168.1.42", type: 'activity', metadata: { changes: { status: "inactive -> active" } } },
  { id: "log_act_002", timestamp: new Date(Date.now() - 3600000).toISOString(), actor: "System", event: "Customer Suspension", resource: "Client XYZ", message: "Customer suspended due to payment failure", status: "warning", ip: "10.0.0.1", type: 'activity', metadata: { reason: "Payment failure" } },
  { id: "log_act_003", timestamp: new Date(Date.now() - 7200000).toISOString(), actor: "Admin User", event: "New Customer Onboarded", resource: "Tech Solutions Ltd", message: "Global account created for new enterprise customer", status: "success", ip: "192.168.1.15", type: 'activity' },
]);

const summaryData = [
  { label: 'Total Logs', value: 1248, icon: 'bi bi-list-ul', bgClass: 'bg-primary-subtle', textClass: 'text-primary' },
  { label: 'Success', value: 1180, icon: 'bi bi-check-circle', bgClass: 'bg-success-subtle', textClass: 'text-success' },
  { label: 'Warnings', value: 45, icon: 'bi bi-exclamation-triangle', bgClass: 'bg-warning-subtle', textClass: 'text-warning' },
  { label: 'Errors', value: 23, icon: 'bi bi-x-circle', bgClass: 'bg-danger-subtle', textClass: 'text-danger' },
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

const handleExport = () => alert('Exporting activity logs...');

const showLogDetail = (log: LogEntry) => {
  selectedLog.value = log;
  isDrawerOpen.value = true;
};

useHead({ title: 'Activity Logs | AI Admin' });
</script>
