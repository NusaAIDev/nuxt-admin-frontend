<template>
  <div class="text-center py-5">
    <div class="mb-4">
      <div class="bg-light-subtle rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
        <i class="bi bi-people fs-1 text-muted"></i>
      </div>
    </div>
    <h4 class="fw-bold">No Customer Selected</h4>
    <p class="text-secondary mx-auto" style="max-width: 400px;">
      To access operational modules like Inbox, Templates, or Knowledge Base, you must first select a customer workspace.
    </p>
    <div class="mt-4">
      <NuxtLink to="/customers" class="btn btn-primary px-4">
        <i class="bi bi-search me-2"></i>Select a Customer
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.bg-light-subtle {
  background-color: #f3f4f6;
}
</style>
