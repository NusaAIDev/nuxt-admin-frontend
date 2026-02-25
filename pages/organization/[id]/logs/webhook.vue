<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h6 class="fw-bold mb-0">Webhook Logs</h6>
      <span class="badge text-bg-light border">{{ logs.length }} records</span>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr class="text-secondary small text-uppercase">
            <th>Time</th>
            <th>Event</th>
            <th>Conversation</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td class="small">{{ log.time }}</td>
            <td>{{ log.event }}</td>
            <td class="font-monospace small">{{ log.conversationId }}</td>
            <td>
              <span
                class="badge"
                :class="log.status === 'SUCCESS' ? 'text-bg-success-subtle text-success-emphasis' : 'text-bg-danger-subtle text-danger-emphasis'"
              >
                {{ log.status }}
              </span>
            </td>
            <td class="small text-secondary">{{ log.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const logs = [
  {
    id: "wh_1",
    time: "Feb 25, 2026 09:30",
    event: "messages",
    conversationId: "conv_20260225_01",
    status: "SUCCESS",
    detail: "Inbound message payload accepted",
  },
  {
    id: "wh_2",
    time: "Feb 25, 2026 09:34",
    event: "statuses",
    conversationId: "conv_20260225_01",
    status: "SUCCESS",
    detail: "Delivery status updated",
  },
  {
    id: "wh_3",
    time: "Feb 25, 2026 10:02",
    event: "messages",
    conversationId: "conv_20260225_04",
    status: "FAILED",
    detail: "Signature validation failed",
  },
];
</script>
