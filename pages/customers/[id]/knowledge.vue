<template>
  <div>
    <!-- Upload Section -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-bold">Upload Documents</h5>
      </div>
      <div class="card-body">
        <div class="upload-area border-2 border-dashed rounded p-4 text-center" style="border-color: #e5e7eb;">
          <i class="bi bi-cloud-upload fs-1 text-primary mb-3"></i>
          <p class="mb-2">Drag and drop files here or click to browse</p>
          <p class="text-muted small mb-3">Supported formats: PDF, TXT (Max 10MB)</p>
          <input type="file" id="fileInput" class="d-none" accept=".pdf,.txt" multiple>
          <label for="fileInput" class="btn btn-primary">
            <i class="bi bi-file-earmark-arrow-up me-2"></i>Choose Files
          </label>
        </div>
        
        <div v-if="uploadingFiles.length > 0" class="mt-3">
          <div v-for="file in uploadingFiles" :key="file.name" class="alert alert-info d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            <span>Processing {{ file.name }}...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-bold">Documents ({{ documents.length }})</h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Filename</th>
                <th>Size</th>
                <th>Total Chunks</th>
                <th>Status</th>
                <th>Upload Date</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in documents" :key="doc.id">
                <td class="ps-4">
                  <i :class="doc.type === 'pdf' ? 'bi bi-file-pdf text-danger' : 'bi bi-file-text text-primary'" class="me-2"></i>
                  <span class="fw-medium">{{ doc.filename }}</span>
                </td>
                <td>{{ formatSize(doc.size) }}</td>
                <td>{{ doc.totalChunks }}</td>
                <td>
                  <span :class="{
                    'badge bg-success-subtle text-success': doc.status === 'ready',
                    'badge bg-warning-subtle text-warning': doc.status === 'processing',
                    'badge bg-danger-subtle text-danger': doc.status === 'failed'
                  }">
                    {{ doc.status }}
                  </span>
                </td>
                <td>{{ formatDate(doc.uploadDate) }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-secondary me-1" title="Reprocess">
                    <i class="bi bi-arrow-repeat"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Delete">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
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
import type { KnowledgeDocument } from '~/types';

const customerStore = useCustomerStore();
const route = useRoute();
const uploadingFiles = ref<File[]>([]);

// Mock documents data
const documents = ref<KnowledgeDocument[]>([
  {
    id: '1',
    customerId: route.params.id as string,
    filename: 'product-catalog-2024.pdf',
    size: 2458624,
    totalChunks: 45,
    status: 'ready',
    uploadDate: '2024-02-10',
    type: 'pdf'
  },
  {
    id: '2',
    customerId: route.params.id as string,
    filename: 'faq-customer-service.txt',
    size: 156789,
    totalChunks: 12,
    status: 'ready',
    uploadDate: '2024-02-08',
    type: 'txt'
  },
  {
    id: '3',
    customerId: route.params.id as string,
    filename: 'company-policies.pdf',
    size: 1024000,
    totalChunks: 28,
    status: 'processing',
    uploadDate: '2024-02-13',
    type: 'pdf'
  }
]);

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

useHead({
  title: 'Knowledge Base - AI Admin'
});

onMounted(() => {
  if (!customerStore.currentCustomer) {
    customerStore.fetchCustomerById(route.params.id as string);
  }
});
</script>

<style scoped>
.upload-area {
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  background-color: #f9fafb;
  border-color: #4F46E5 !important;
}
</style>
