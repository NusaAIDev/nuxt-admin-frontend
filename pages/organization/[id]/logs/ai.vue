<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h6 class="fw-bold mb-0">AI Assistant Logs</h6>
      <span class="badge text-bg-light border">{{ logs.length }} records</span>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr class="text-secondary small text-uppercase">
            <th>Time</th>
            <th>Conversation</th>
            <th>Model</th>
            <th>Tokens</th>
            <th>Latency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td class="small">{{ log.time }}</td>
            <td class="font-monospace small">{{ log.conversationId }}</td>
            <td>{{ log.model }}</td>
            <td>{{ log.tokens }}</td>
            <td>{{ log.latency }} ms</td>
            <td>
              <span
                class="badge"
                :class="log.status === 'SUCCESS' ? 'text-bg-success-subtle text-success-emphasis' : 'text-bg-danger-subtle text-danger-emphasis'"
              >
                {{ log.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const logs = [
  {
    id: "ai_1",
    time: "Feb 25, 2026 09:31",
    conversationId: "conv_20260225_01",
    model: "gpt-4.1-mini",
    tokens: 624,
    latency: 912,
    status: "SUCCESS",
  },
  {
    id: "ai_2",
    time: "Feb 25, 2026 09:40",
    conversationId: "conv_20260225_02",
    model: "gpt-4.1-mini",
    tokens: 702,
    latency: 1041,
    status: "SUCCESS",
  },
  {
    id: "ai_3",
    time: "Feb 25, 2026 10:05",
    conversationId: "conv_20260225_04",
    model: "gpt-4.1-mini",
    tokens: 0,
    latency: 0,
    status: "FAILED",
  },
];
</script>
