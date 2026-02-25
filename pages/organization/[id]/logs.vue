<template>
  <div>
    <div class="mb-4">
      <h4 class="fw-bold mb-1">Operational Logs</h4>
      <p class="text-secondary small mb-0">
        System level audit trails and AI interaction logs.
      </p>
    </div>

    <div class="p-3 bg-white border-0 rounded shadow-sm min-vh-25">
      <NuxtErrorBoundary>
        <NuxtPage />
        <template #error="{ error }">
          <div class="alert alert-danger mb-0">
            <h6 class="alert-heading fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Error loading
              logs
            </h6>
            <p class="mb-0 small">{{ error }}</p>
            <button
              class="btn btn-sm btn-outline-danger mt-2"
              @click="error.value = null"
            >
              Try again
            </button>
          </div>
        </template>
      </NuxtErrorBoundary>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.min-vh-25 {
  min-height: 25vh;
}
</style>
