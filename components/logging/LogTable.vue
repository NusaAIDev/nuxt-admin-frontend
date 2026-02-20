<template>
  <div class="card border-0 shadow-sm overflow-hidden">
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="bg-light sticky-top" style="z-index: 5">
          <tr>
            <th class="ps-4 py-3 text-secondary fw-semibold extra-small text-uppercase" style="width: 180px">Timestamp</th>
            <th class="py-3 text-secondary fw-semibold extra-small text-uppercase" style="width: 250px">Event Action</th>
            <th class="py-3 text-secondary fw-semibold extra-small text-uppercase">Message</th>
            <th class="py-3 text-secondary fw-semibold extra-small text-uppercase" style="width: 150px">Status</th>
            <th class="pe-4 py-3 text-end text-secondary fw-semibold extra-small text-uppercase" style="width: 100px">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td class="ps-4 py-3">
              <div class="text-dark fw-medium small">{{ formatTime(log.timestamp) }}</div>
              <div class="text-secondary extra-small">{{ formatDate(log.timestamp) }}</div>
            </td>
            <td class="py-3">
              <div class="text-dark fw-bold small">{{ log.event }}</div>
              <div class="text-secondary extra-small">{{ log.resource }}</div>
            </td>
            <td class="py-3">
              <div class="text-dark small line-clamp-2" style="max-width: 450px; font-size: 0.85rem">
                {{ log.message || log.metadata?.reason || log.metadata?.error || 'No additional details' }}
              </div>
            </td>
            <td class="py-3">
              <span 
                class="badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2 border-0"
                :class="getStatusClass(log.status)"
                style="font-size: 0.75rem"
              >
                <span class="dot" :class="'bg-' + log.status"></span>
                {{ log.status.charAt(0).toUpperCase() + log.status.slice(1) }}
              </span>
            </td>
            <td class="pe-4 py-3 text-end">
              <button class="btn btn-sm btn-white border shadow-sm px-3 extra-small fw-semibold" @click="emitDetail(log)">
                Inspect
              </button>
            </td>
          </tr>
          <tr v-if="logs.length === 0">
            <td colspan="7" class="text-center py-5">
              <div class="text-muted opacity-50 mb-2">
                <i class="bi bi-file-earmark-text fs-1"></i>
              </div>
              <h5 class="text-secondary">No logs found matching your criteria</h5>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  logs: Array<{
    id: string;
    timestamp: string;
    event: string;
    resource: string;
    message?: string;
    status: 'success' | 'warning' | 'error';
    metadata?: any;
  }>
}>();

const emit = defineEmits(['view-detail']);

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getActorInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success': return 'bg-success-subtle text-success';
    case 'warning': return 'bg-warning-subtle text-warning';
    case 'error': return 'bg-danger-subtle text-danger';
    default: return 'bg-secondary-subtle text-secondary';
  }
};

const emitDetail = (log: any) => {
  emit('view-detail', log);
};
</script>

<style scoped>
.extra-small {
  font-size: 0.7rem;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.btn-white {
  background-color: #fff;
  color: #475569;
}
.btn-white:hover {
  background-color: #f8fafc;
}
</style>
