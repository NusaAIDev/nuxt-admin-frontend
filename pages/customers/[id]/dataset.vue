<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">Knowledge Dataset</h4>
        <p class="text-secondary small mb-0">
          Manage training data and sources
        </p>
      </div>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addKnowledgeModal"
      >
        <i class="bi bi-plus-lg me-2"></i>Add Knowledge
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="datasetStore.loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="datasetStore.error" class="alert alert-danger m-4">
          {{ datasetStore.error }}
        </div>
        <div v-else>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">Type</th>
                  <th>Content / Source</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in datasetStore.knowledgeItems" :key="item.id">
                  <td class="ps-4">
                    <i
                      v-if="item.type === 'text'"
                      class="bi bi-file-text me-2"
                    ></i>
                    <i
                      v-else-if="item.type === 'pdf'"
                      class="bi bi-file-pdf text-danger me-2"
                    ></i>
                    <i v-else class="bi bi-globe text-primary me-2"></i>
                    <span class="fw-medium">{{ item.type.toUpperCase() }}</span>
                  </td>
                  <td class="text-truncate" style="max-width: 300px">
                    {{ item.content }}
                  </td>
                  <td>
                    <span
                      :class="{
                        'badge bg-success-subtle text-success':
                          item.status === 'trained',
                        'badge bg-warning-subtle text-warning':
                          item.status === 'processing',
                        'badge bg-danger-subtle text-danger':
                          item.status === 'failed',
                      }"
                      >{{ item.status }}</span
                    >
                  </td>
                  <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger">
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

    <!-- Modal for adding knowledge -->
    <!-- Note: In a real app we'd use a proper modal component or library -->
  </div>
</template>

<script setup lang="ts">
import { useDatasetStore } from "~/stores/dataset";

const route = useRoute();
const datasetStore = useDatasetStore();

onMounted(() => {
  datasetStore.fetchKnowledgeByCustomer(route.params.id as string);
});
</script>
