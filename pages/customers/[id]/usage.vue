<template>
  <div>
    <!-- Metrics Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-6 col-lg-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="text-secondary small mb-1">Total Messages</div>
            <h3 class="fw-bold mb-0">{{ usage.totalMessages.toLocaleString() }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="text-secondary small mb-1">AI Requests</div>
            <h3 class="fw-bold mb-0">{{ usage.totalAiRequests.toLocaleString() }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="text-secondary small mb-1">Total Tokens</div>
            <h3 class="fw-bold mb-0">{{ usage.totalTokens.toLocaleString() }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="text-secondary small mb-1">WA Conversations</div>
            <h3 class="fw-bold mb-0">{{ usage.totalWaConversations.toLocaleString() }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Metrics -->
    <div class="row mb-4">
      <div class="col-lg-6">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 fw-bold">OpenAI Usage</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-secondary">Prompt Tokens</span>
                <span class="fw-medium">{{ usage.promptTokens.toLocaleString() }}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-secondary">Completion Tokens</span>
                <span class="fw-medium">{{ usage.completionTokens.toLocaleString() }}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-secondary">Total Tokens</span>
                <span class="fw-bold">{{ usage.totalTokens.toLocaleString() }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <span class="text-secondary fw-medium">Estimated Cost</span>
                <span class="fw-bold text-primary fs-5">${{ usage.estimatedOpenAiCost.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 fw-bold">WhatsApp Usage</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-secondary">Total Conversations</span>
                <span class="fw-medium">{{ usage.totalWaConversations.toLocaleString() }}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-secondary">Rate per Conversation</span>
                <span class="fw-medium">$0.005</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <span class="text-secondary fw-medium">Estimated Cost</span>
                <span class="fw-bold text-success fs-5">${{ usage.estimatedWaCost.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Breakdown -->
    <div class="card shadow-sm border-0" v-if="usage.dailyBreakdown">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-bold">Daily Breakdown</h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Date</th>
                <th>Messages</th>
                <th>AI Requests</th>
                <th>Tokens</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in usage.dailyBreakdown" :key="day.date">
                <td class="ps-4">{{ formatDate(day.date) }}</td>
                <td>{{ day.messages.toLocaleString() }}</td>
                <td>{{ day.aiRequests.toLocaleString() }}</td>
                <td>{{ day.tokens.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';
import type { UsageMetrics } from '~/types';

const customerStore = useCustomerStore();
const route = useRoute();

// Mock usage data
const usage = ref<UsageMetrics>({
  customerId: route.params.id as string,
  month: '2024-02',
  totalMessages: 1250,
  totalAiRequests: 1180,
  promptTokens: 45600,
  completionTokens: 28900,
  totalTokens: 74500,
  estimatedOpenAiCost: 3.73,
  totalWaConversations: 245,
  estimatedWaCost: 1.23,
  dailyBreakdown: [
    { date: '2024-02-01', messages: 45, aiRequests: 42, tokens: 2800 },
    { date: '2024-02-02', messages: 52, aiRequests: 49, tokens: 3200 },
    { date: '2024-02-03', messages: 38, aiRequests: 35, tokens: 2400 },
    { date: '2024-02-04', messages: 61, aiRequests: 58, tokens: 3800 },
    { date: '2024-02-05', messages: 48, aiRequests: 45, tokens: 3000 }
  ]
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

useHead({
  title: 'Usage Panel - AI Admin'
});

onMounted(() => {
  if (!customerStore.currentCustomer) {
    customerStore.fetchCustomerById(route.params.id as string);
  }
});
</script>
