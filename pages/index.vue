<template>
  <div>
    <div class="d-flex justify-content-between align-items-end mb-40">
      <div>
        <h2 class="fw-bold text-dark mb-2">Global Dashboard</h2>
        <p class="text-secondary mb-0 fs-5">
          System-wide monitoring across all organizations
        </p>
      </div>
      <div>
        <button class="btn btn-white border shadow-sm px-4 py-2">
          <i class="bi bi-download me-2"></i>Export Report
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row g-4 mb-32">
      <div class="col-md-4 col-lg-2-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <label class="fw-bold text-dark">Total Organizations</label>
              <div
                class="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                style="width: 48px; height: 48px"
              >
                <i class="bi bi-people fs-4"></i>
              </div>
            </div>
            <div class="mb-3">
              <h2 class="fw-bold text-dark mb-0">
                {{ metrics.totalCustomers }}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-lg-2-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <label class="fw-bold text-dark">WA Connected</label>
              <div
                class="bg-success-subtle text-success rounded-circle p-2 d-flex align-items-center justify-content-center"
                style="width: 48px; height: 48px"
              >
                <i class="bi bi-whatsapp fs-4"></i>
              </div>
            </div>
            <div class="mb-3">
              <h2 class="fw-bold text-dark mb-0">
                {{ metrics.totalWaConnected }}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-lg-2-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <label class="fw-bold text-dark">Active Chats</label>
              <div
                class="bg-info-subtle text-info rounded-circle p-2 d-flex align-items-center justify-content-center"
                style="width: 48px; height: 48px"
              >
                <i class="bi bi-chat-dots fs-4"></i>
              </div>
            </div>
            <div class="mb-3">
              <h2 class="fw-bold text-dark mb-0">
                {{ metrics.totalActiveConversations }}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-lg-2-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <label class="fw-bold text-dark">Messages Today</label>
              <div
                class="bg-warning-subtle text-warning rounded-circle p-2 d-flex align-items-center justify-content-center"
                style="width: 48px; height: 48px"
              >
                <i class="bi bi-envelope fs-4"></i>
              </div>
            </div>
            <div class="mb-3">
              <h2 class="fw-bold text-dark mb-0">
                {{ metrics.totalMessagesToday }}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-lg-2-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <label class="fw-bold text-dark">AI Ratio</label>
              <div
                class="bg-purple-subtle text-purple rounded-circle p-2 d-flex align-items-center justify-content-center"
                style="width: 48px; height: 48px"
              >
                <i class="bi bi-robot fs-4"></i>
              </div>
            </div>
            <div class="mb-3">
              <h2 class="fw-bold text-dark mb-0">{{ aiRatioPercent }}%</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Chart -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm h-100">
          <div
            class="card-header py-4 px-4 bg-white border-bottom-0 d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0 fw-bold">Message Volume</h5>
            <button
              class="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-2 text-secondary"
            >
              <i class="bi bi-calendar4"></i> Last 7 Days
              <i class="bi bi-chevron-down small"></i>
            </button>
          </div>
          <div class="card-body p-4">
            <div class="chart-placeholder text-center py-5 bg-light rounded-3">
              <i class="bi bi-bar-chart fs-1 text-muted opacity-25"></i>
              <p class="text-muted mt-2">Chart visualization would go here</p>
              <div class="d-flex justify-content-around mt-4 px-4">
                <div
                  v-for="day in metrics.messageVolume7Days"
                  :key="day.date"
                  class="text-center"
                >
                  <div class="text-muted small mb-1">
                    {{ formatDate(day.date) }}
                  </div>
                  <div class="fw-bold text-primary">{{ day.count }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHead } from '#imports';
import type { DashboardMetrics } from "~/types";

// Mock data - in real app this would come from API
const metrics = ref<DashboardMetrics>({
  totalCustomers: 4,
  totalWaConnected: 3,
  totalActiveConversations: 12,
  totalMessagesToday: 156,
  aiVsHumanRatio: {
    ai: 142,
    human: 14,
  },
  messageVolume7Days: [
    { date: "2024-02-07", count: 98 },
    { date: "2024-02-08", count: 125 },
    { date: "2024-02-09", count: 143 },
    { date: "2024-02-10", count: 167 },
    { date: "2024-02-11", count: 134 },
    { date: "2024-02-12", count: 189 },
    { date: "2024-02-13", count: 156 },
  ],
});

const aiRatioPercent = computed(() => {
  const total =
    metrics.value.aiVsHumanRatio.ai + metrics.value.aiVsHumanRatio.human;
  return total > 0
    ? Math.round((metrics.value.aiVsHumanRatio.ai / total) * 100)
    : 0;
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

useHead({
  title: "Dashboard - AI Admin",
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
