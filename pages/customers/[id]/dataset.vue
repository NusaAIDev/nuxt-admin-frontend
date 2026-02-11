<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Knowledge Base</h4>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addKnowledgeModal">
            <i class="bi bi-plus-lg"></i> Add Knowledge
        </button>
    </div>

    <div v-if="datasetStore.loading" class="text-center">
         <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else-if="datasetStore.error" class="alert alert-danger">
        {{ datasetStore.error }}
    </div>
    <div v-else>
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Content / Source</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in datasetStore.knowledgeItems" :key="item.id">
                        <td>
                            <i v-if="item.type === 'text'" class="bi bi-file-text"></i>
                            <i v-else-if="item.type === 'pdf'" class="bi bi-file-pdf text-danger"></i>
                            <i v-else class="bi bi-globe text-primary"></i>
                            {{ item.type.toUpperCase() }}
                        </td>
                        <td class="text-truncate" style="max-width: 300px;">{{ item.content }}</td>
                        <td>
                            <span :class="{
                                'badge bg-success': item.status === 'trained',
                                'badge bg-warning': item.status === 'processing',
                                'badge bg-danger': item.status === 'failed'
                            }">{{ item.status }}</span>
                        </td>
                        <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal for adding knowledge -->
    <!-- Note: In a real app we'd use a proper modal component or library -->
  </div>
</template>

<script setup lang="ts">
import { useDatasetStore } from '~/stores/dataset';

const route = useRoute();
const datasetStore = useDatasetStore();

onMounted(() => {
    datasetStore.fetchKnowledgeByCustomer(route.params.id as string);
});
</script>
