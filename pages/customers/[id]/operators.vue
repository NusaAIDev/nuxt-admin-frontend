<template>
  <div class="container-fluid py-2">
    <div class="mb-4 d-flex justify-content-between align-items-end flex-wrap gap-2">
      <div>
        <h5 class="fw-bold text-dark mb-1">Operator Handover</h5>
        <p class="text-secondary mb-0 small">
          Track escalation events from AI to human operator.
        </p>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <h6 class="fw-bold mb-0">Handover Events</h6>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Timestamp</th>
                <th>Conversation</th>
                <th>Event</th>
                <th>Assigned To</th>
                <th>Total Messages</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in handoverEvents" :key="event.id">
                <td class="ps-4">{{ formatDate(event.timestamp) }}</td>
                <td>{{ event.conversationId }}</td>
                <td>{{ event.event }}</td>
                <td>{{ event.assignedTo || "-" }}</td>
                <td>{{ event.totalMessages }}</td>
                <td>
                  <span class="badge" :class="statusClass(event.status)">
                    {{ event.status.toUpperCase() }}
                  </span>
                </td>
                <td>{{ event.detail }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

definePageMeta({
  alias: ["/organization/:id/operator-handover", "/customers/:id/operators"],
});

type HandoverStatus = "pending" | "accepted" | "resolved" | "timeout";

interface HandoverEvent {
  id: string;
  conversationId: string;
  timestamp: string;
  event: string;
  detail: string;
  assignedTo: string | null;
  totalMessages: number;
  status: HandoverStatus;
}

const handoverEvents = computed<HandoverEvent[]>(() => [
  {
    id: "evt_001",
    conversationId: "conv_20260224_01",
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    event: "AI offered handover",
    detail: "Customer asked deep technical integration question.",
    assignedTo: null,
    totalMessages: 18,
    status: "pending",
  },
  {
    id: "evt_002",
    conversationId: "conv_20260224_02",
    timestamp: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
    event: "Customer accepted handover",
    detail: "User replied: 'yes, connect me to admin'.",
    assignedTo: "Admin User",
    totalMessages: 24,
    status: "accepted",
  },
  {
    id: "evt_003",
    conversationId: "conv_20260223_07",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    event: "Resolved by operator",
    detail: "Issue solved after manual follow-up.",
    assignedTo: "Admin User",
    totalMessages: 31,
    status: "resolved",
  },
]);

const statusClass = (status: HandoverStatus) => {
  switch (status) {
    case "pending":
      return "bg-warning-subtle text-warning border border-warning-subtle";
    case "accepted":
      return "bg-info-subtle text-info border border-info-subtle";
    case "resolved":
      return "bg-success-subtle text-success border border-success-subtle";
    case "timeout":
      return "bg-danger-subtle text-danger border border-danger-subtle";
    default:
      return "bg-secondary-subtle text-secondary border border-secondary-subtle";
  }
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

useHead({
  title: "Operator Handover - AI Admin",
});
</script>
