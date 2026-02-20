<template>
  <div 
    class="offcanvas offcanvas-end border-0 shadow" 
    :class="{ 'show': isOpen }" 
    tabindex="-1" 
    style="width: 450px; visibility: visible"
    v-if="isOpen"
  >
    <div class="offcanvas-header border-bottom py-4 px-4 bg-light">
      <h5 class="offcanvas-title fw-bold">Log Details</h5>
      <button type="button" class="btn-close shadow-none" @click="close"></button>
    </div>
    <div class="offcanvas-body p-4" v-if="log">
      <!-- Status Box -->
      <div class="rounded-3 border p-3 mb-4 d-flex align-items-center justify-content-between" :class="getStatusBorder(log.status)">
        <div class="d-flex align-items-center gap-3">
           <div 
              class="rounded-circle d-flex align-items-center justify-content-center" 
              :class="getStatusBg(log.status)"
              style="width: 40px; height: 40px"
            >
              <i :class="getStatusIcon(log.status)" class="fs-5"></i>
            </div>
            <div>
              <div class="fw-bold text-dark">{{ log.event }}</div>
              <div class="text-secondary extra-small">{{ formatFullDate(log.timestamp) }}</div>
            </div>
        </div>
        <span class="badge px-3 py-2 rounded-pill border-0" :class="getStatusBadge(log.status)">
          {{ log.status.toUpperCase() }}
        </span>
      </div>

      <!-- Key Details -->
      <div class="mb-4">
        <h6 class="text-uppercase text-secondary fw-bold extra-small mb-3" style="letter-spacing: 0.05em">Core Information</h6>
        <div class="list-group list-group-flush border rounded-3 p-1">
          <div class="list-group-item border-0 d-flex justify-content-between align-items-center py-2">
            <span class="text-secondary small">Actor</span>
            <span class="text-dark fw-medium small">{{ log.actor }}</span>
          </div>
          <div class="list-group-item border-0 d-flex justify-content-between align-items-center py-2">
            <span class="text-secondary small">Resource</span>
            <span class="text-dark fw-medium small">{{ log.resource }}</span>
          </div>
          <div class="list-group-item border-0 d-flex justify-content-between align-items-center py-2">
            <span class="text-secondary small">IP Address</span>
            <span class="text-dark fw-medium small text-monospace">{{ log.ip }}</span>
          </div>
          <div class="list-group-item border-0 d-flex justify-content-between align-items-center py-2">
            <span class="text-secondary small">Request ID</span>
            <span class="text-primary small fw-medium">req_{{ log.id.substring(4) }}</span>
          </div>
        </div>
      </div>

      <!-- Metadata / JSON Viewer Style -->
      <div>
        <h6 class="text-uppercase text-secondary fw-bold extra-small mb-3" style="letter-spacing: 0.05em">Metadata Payload</h6>
        <div class="bg-dark text-light p-3 rounded-3 position-relative overflow-hidden shadow-sm">
          <pre class="mb-0 extra-small thin-scrollbar" style="max-height: 300px; color: #a5d6ff opacity: 0.9"><code>{{ formatMetadata(log.metadata) }}</code></pre>
          <div class="position-absolute top-0 end-0 p-2">
            <button class="btn btn-dark btn-sm p-1 opacity-50 hover-opacity-100" @click="copyMetadata">
              <i class="bi bi-clipboard"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Footer Actions -->
      <div class="mt-auto pt-4 d-grid">
        <button class="btn btn-outline-secondary" @click="close">Close Details</button>
      </div>
    </div>
  </div>
  <!-- Backdrop -->
  <div class="offcanvas-backdrop fade show" v-if="isOpen" @click="close" style="z-index: 1045"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  log: any;
}>();

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const formatFullDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

const formatMetadata = (metadata: any) => {
  return JSON.stringify(metadata || { 
    action: "updated_api_key", 
    browser: "Chrome 121.0.0", 
    os: "macOS Sonoma", 
    changes: { status: "inactive -> active" } 
  }, null, 2);
};

const getStatusBorder = (status: string) => {
  switch (status) {
    case 'success': return 'border-success-subtle bg-success-subtle bg-opacity-10';
    case 'warning': return 'border-warning-subtle bg-warning-subtle bg-opacity-10';
    case 'error': return 'border-danger-subtle bg-danger-subtle bg-opacity-10';
    default: return 'border-light bg-light';
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case 'success': return 'bg-success text-white';
    case 'warning': return 'bg-warning text-white';
    case 'error': return 'bg-danger text-white';
    default: return 'bg-secondary text-white';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success': return 'bg-success-subtle text-success';
    case 'warning': return 'bg-warning-subtle text-warning';
    case 'error': return 'bg-danger-subtle text-danger';
    default: return 'bg-secondary-subtle text-secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return 'bi bi-check-circle';
    case 'warning': return 'bi bi-exclamation-triangle';
    case 'error': return 'bi bi-x-circle';
    default: return 'bi bi-info-circle';
  }
};

const copyMetadata = () => {
  navigator.clipboard.writeText(formatMetadata(props.log.metadata));
};
</script>

<style scoped>
.extra-small {
  font-size: 0.7rem;
}
.text-monospace {
  font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.offcanvas {
  z-index: 1050;
  transition: transform 0.3s ease-in-out;
}
.show {
  transform: none;
}
.thin-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.thin-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.thin-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.hover-opacity-100:hover {
  opacity: 1 !important;
}
</style>
