<template>
  <div class="card border-0 shadow-sm mb-4">
    <div class="card-body p-4">
      <div class="row g-3 align-items-center">
        <!-- Search -->
        <div class="col-lg-4">
          <div class="input-group search-input-group shadow-none border rounded-3 p-1 bg-light">
            <span class="input-group-text bg-transparent border-0 px-3">
              <i class="bi bi-search text-secondary"></i>
            </span>
            <input
              v-model="filters.query"
              type="text"
              class="form-control bg-transparent border-0 p-2 shadow-none"
              placeholder="Search by event, actor, or resource..."
              @input="emitChange"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="col-md-6 col-lg-2">
          <select v-model="filters.status" class="form-select border shadow-sm py-2 px-3 bg-white" @change="emitChange">
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <!-- Date Range (Mocked for now) -->
        <div class="col-md-6 col-lg-3">
          <div class="input-group search-input-group shadow-none border rounded-3 p-1 bg-white">
            <span class="input-group-text bg-transparent border-0 px-3">
              <i class="bi bi-calendar3 text-secondary"></i>
            </span>
            <input
              v-model="filters.dateRange"
              type="text"
              class="form-control bg-transparent border-0 p-2 shadow-none"
              placeholder="Feb 20, 2026 - Today"
              readonly
            />
          </div>
        </div>

        <!-- Refresh & Actions -->
        <div class="col-lg-3 d-flex justify-content-lg-end gap-2">
          <button class="btn btn-white border shadow-sm px-3 d-flex align-items-center gap-2" @click="emitRefresh">
            <i class="bi bi-arrow-clockwise h-rotate" :class="{ 'refreshing': refreshing }"></i>
            Refresh
          </button>
          <button class="btn btn-white border shadow-sm px-3 d-flex align-items-center gap-2" @click="emitExport">
            <i class="bi bi-download"></i>
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const props = defineProps<{
  refreshing?: boolean;
}>();

const emit = defineEmits(['change', 'refresh', 'export']);

const filters = reactive({
  query: '',
  status: '',
  dateRange: '',
});

const emitChange = () => {
  emit('change', { ...filters });
};

const emitRefresh = () => {
  emit('refresh');
};

const emitExport = () => {
  emit('export');
};
</script>

<style scoped>
.h-rotate {
  transition: transform 0.5s ease;
}
.refreshing {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.btn-white {
  background-color: #fff;
  color: #475569;
}
.btn-white:hover {
  background-color: #f8fafc;
}
</style>
