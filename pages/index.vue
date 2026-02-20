<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold text-dark mb-1">Global Dashboard</h3>
            <p class="text-secondary mb-0">System-wide monitoring across all customers</p>
        </div>
        <div>
            <button class="btn btn-white border shadow-sm me-2"><i class="bi bi-download me-2"></i>Export Report</button>
        </div>
    </div>

    <!-- Summary Cards -->
    <div class="row g-4 mb-4">
        <div class="col-md-4 col-lg-2-4">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">Total Customers</p>
                            <h2 class="fw-bold text-dark mb-0">{{ metrics.totalCustomers }}</h2>
                        </div>
                        <div class="bg-primary-subtle text-primary rounded p-2">
                             <i class="bi bi-people fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2-4">
             <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">WA Connected</p>
                            <h2 class="fw-bold text-dark mb-0">{{ metrics.totalWaConnected }}</h2>
                        </div>
                        <div class="bg-success-subtle text-success rounded p-2">
                             <i class="bi bi-whatsapp fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2-4">
             <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">Active Conversations</p>
                            <h2 class="fw-bold text-dark mb-0">{{ metrics.totalActiveConversations }}</h2>
                        </div>
                        <div class="bg-info-subtle text-info rounded p-2">
                             <i class="bi bi-chat-dots fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2-4">
             <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">Messages Today</p>
                            <h2 class="fw-bold text-dark mb-0">{{ metrics.totalMessagesToday }}</h2>
                        </div>
                        <div class="bg-warning-subtle text-warning rounded p-2">
                             <i class="bi bi-envelope fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2-4">
             <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">AI vs Human</p>
                            <h2 class="fw-bold text-dark mb-0">{{ aiRatioPercent }}%</h2>
                        </div>
                        <div class="bg-purple-subtle text-purple rounded p-2">
                             <i class="bi bi-robot fs-4"></i>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="badge bg-primary-subtle text-primary me-2">AI: {{ metrics.aiVsHumanRatio.ai }}</span>
                        <span class="badge bg-secondary-subtle text-secondary">Human: {{ metrics.aiVsHumanRatio.human }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Activity Chart & System Status -->
    <div class="row mb-4">
        <div class="col-lg-8">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white border-bottom-0 py-3">
                    <h5 class="mb-0 fw-bold">Message Volume (7 Days)</h5>
                </div>
                <div class="card-body">
                    <div class="chart-placeholder text-center py-5">
                        <i class="bi bi-bar-chart fs-1 text-muted"></i>
                        <p class="text-muted mt-2">Chart visualization would go here</p>
                        <div class="d-flex justify-content-around mt-4">
                            <div v-for="day in metrics.messageVolume7Days" :key="day.date" class="text-center">
                                <div class="text-muted small">{{ formatDate(day.date) }}</div>
                                <div class="fw-bold text-primary">{{ day.count }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="card shadow-sm border-0 h-100">
                <div class="card-header bg-white border-bottom-0 py-3">
                    <h5 class="mb-0 fw-bold">System Status</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-secondary">Webhook Status</span>
                            <span :class="metrics.systemStatus.webhookStatus === 'ok' ? 'badge bg-success' : 'badge bg-danger'">
                                {{ metrics.systemStatus.webhookStatus.toUpperCase() }}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-secondary">AI API Status</span>
                            <span :class="metrics.systemStatus.aiApiStatus === 'ok' ? 'badge bg-success' : 'badge bg-danger'">
                                {{ metrics.systemStatus.aiApiStatus.toUpperCase() }}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-secondary">Failed Messages</span>
                            <span :class="metrics.systemStatus.failedMessagesCount > 0 ? 'badge bg-warning' : 'badge bg-success'">
                                {{ metrics.systemStatus.failedMessagesCount }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardMetrics } from '~/types';

// Mock data - in real app this would come from API
const metrics = ref<DashboardMetrics>({
  totalCustomers: 4,
  totalWaConnected: 3,
  totalActiveConversations: 12,
  totalMessagesToday: 156,
  aiVsHumanRatio: {
    ai: 142,
    human: 14
  },
  messageVolume7Days: [
    { date: '2024-02-07', count: 98 },
    { date: '2024-02-08', count: 125 },
    { date: '2024-02-09', count: 143 },
    { date: '2024-02-10', count: 167 },
    { date: '2024-02-11', count: 134 },
    { date: '2024-02-12', count: 189 },
    { date: '2024-02-13', count: 156 }
  ],
  systemStatus: {
    webhookStatus: 'ok',
    aiApiStatus: 'ok',
    failedMessagesCount: 0
  }
});

const aiRatioPercent = computed(() => {
  const total = metrics.value.aiVsHumanRatio.ai + metrics.value.aiVsHumanRatio.human;
  return total > 0 ? Math.round((metrics.value.aiVsHumanRatio.ai / total) * 100) : 0;
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

useHead({
  title: 'Dashboard - AI Admin'
});
</script>

<style scoped>
.col-lg-2-4 {
  flex: 0 0 auto;
  width: 20%;
}

@media (max-width: 991.98px) {
  .col-lg-2-4 {
    width: 50%;
  }
}

.bg-purple-subtle {
  background-color: #f3e8ff !important;
}

.text-purple {
  color: #9333ea !important;
}
</style>
