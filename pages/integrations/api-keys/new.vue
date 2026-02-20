<template>
  <div class="container py-4">
    <!-- Header/Back Navigation -->
    <div class="mb-4">
      <NuxtLink to="/integrations/api-keys" class="btn btn-link text-decoration-none p-0 text-secondary mb-2">
        <i class="bi bi-arrow-left me-1"></i> Back to API Keys
      </NuxtLink>
      <h3 class="fw-bold mb-1">Add New API Key</h3>
      <p class="text-secondary">Configure credentials for your external AI providers to enable system-wide integrations.</p>
    </div>

    <!-- Form Section -->
    <div v-if="!showSuccess">
      <form @submit.prevent="saveKey">
        <div class="row">
          <!-- Basic Information Card -->
          <div class="col-md-6 mb-4">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                <h5 class="fw-bold mb-0">
                  <i class="bi bi-info-circle me-2"></i>Key Information
                </h5>
                <p class="text-muted small mb-0">Basic details to help you identify this key.</p>
              </div>
              <div class="card-body px-4 pb-4">
                <div class="mb-3">
                  <label class="form-label fw-medium">Key Name (alias) <span class="text-danger">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control px-3"
                    placeholder="e.g. OpenAI Main Production"
                    required
                  />
                  <div class="form-text small mt-1">
                    Use a descriptive name for easier management.
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-medium">Provider <span class="text-danger">*</span></label>
                    <select v-model="form.provider" class="form-select px-3" required>
                      <option value="" disabled>Select Provider</option>
                      <option value="OpenAI">OpenAI</option>
                      <option value="Anthropic">Anthropic</option>
                      <option value="Google Gemini">Google Gemini</option>
                      <option value="Mistral">Mistral</option>
                      <option value="Perplexity">Perplexity</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-medium">Environment</label>
                    <select v-model="form.environment" class="form-select px-3">
                      <option value="">No Environment</option>
                      <option value="Production">Production</option>
                      <option value="Staging">Staging</option>
                    </select>
                  </div>
                </div>

                <div class="mb-0">
                  <label class="form-label fw-medium">Description / Notes</label>
                  <textarea
                    v-model="form.notes"
                    class="form-control px-3"
                    rows="2"
                    placeholder="Optional details about usage limits or purpose..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Credentials Card -->
          <div class="col-md-6 mb-4">
            <div class="card shadow-sm border-0 h-100 border-primary-subtle border-start border-4">
              <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                <h5 class="fw-bold mb-0 text-primary">
                  <i class="bi bi-shield-lock me-2"></i>Credential Details
                </h5>
                <p class="text-muted small mb-0">Secure authentication details for the provider API.</p>
              </div>
              <div class="card-body px-4 pb-4">
                <div class="mb-4">
                  <label class="form-label fw-medium text-primary">API Key <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <input
                      v-model="form.apiKey"
                      :type="showFullKey ? 'text' : 'password'"
                      class="form-control border-primary-subtle px-3"
                      placeholder="sk-..."
                      required
                    />
                    <button
                      class="btn btn-outline-secondary border-primary-subtle shadow-none"
                      type="button"
                      @click="showFullKey = !showFullKey"
                    >
                      <i class="bi" :class="showFullKey ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                  </div>
                  <div class="form-text small mt-1 text-primary">
                    Enter the full API key provided by the service.
                  </div>
                </div>

                <div class="mb-0">
                  <div class="form-check form-switch d-flex align-items-center gap-3 ps-0">
                    <label class="form-check-label fw-medium text-dark cursor-pointer" for="activeToggle">
                      Active Status
                    </label>
                    <input
                      v-model="form.isActive"
                      class="form-check-input ms-0 mt-0 cursor-pointer"
                      type="checkbox"
                      id="activeToggle"
                      style="width: 44px; height: 22px"
                    />
                  </div>
                  <p class="text-muted small mt-2 mb-0">
                    If disabled, integrations using this key will immediately stop working.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-3 mt-2">
          <NuxtLink to="/integrations/api-keys" class="btn btn-light px-4 border ms-auto">
            Cancel
          </NuxtLink>
          <button type="submit" class="btn btn-primary px-5 shadow-sm">
            Create API Key
          </button>
        </div>
      </form>
    </div>

    <!-- Success View (One-time Display) -->
    <div v-else class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card border-0 shadow-sm p-4 pt-5 text-center">
          <div
            class="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style="width: 80px; height: 80px"
          >
            <i class="bi bi-check-lg fs-1"></i>
          </div>
          <h2 class="fw-bold text-dark mb-3">Key Created Successfully</h2>
          <p class="text-secondary mb-5 px-lg-5">
            For security reasons, this is the **only time** you can see the full key. 
            Please make sure to copy and store it in a safe place.
          </p>

          <div class="bg-light p-4 rounded-3 mb-5 d-flex align-items-center gap-3">
            <code class="text-primary fw-bold flex-grow-1 text-break fs-4">{{
              newlyCreatedKey
            }}</code>
            <button
              @click="copyToClipboard(newlyCreatedKey)"
              class="btn btn-white border shadow-sm px-4 py-3 d-flex align-items-center gap-2"
            >
              <i class="bi" :class="copied ? 'bi-check2 text-success' : 'bi-clipboard'"></i>
              <span class="fw-bold">{{ copied ? "Copied" : "Copy" }}</span>
            </button>
          </div>

          <NuxtLink
            to="/integrations/api-keys"
            class="btn btn-primary w-100 py-3 fw-bold shadow-sm fs-5"
          >
            I've stored the key securely
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useHead } from 'nuxt/app';

const showFullKey = ref(false);
const showSuccess = ref(false);
const newlyCreatedKey = ref("");
const copied = ref(false);

const form = reactive({
  name: "",
  provider: "",
  apiKey: "",
  environment: "",
  isActive: true,
  notes: "",
});

function saveKey() {
  // In a real app, this would be an API call
  const freshKey = form.apiKey || `sk-proj-${Math.random().toString(36).substr(2, 24)}`;
  newlyCreatedKey.value = freshKey;
  showSuccess.value = true;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

useHead({
  title: "Add New API Key | AI Admin",
});
</script>

<style scoped>
.border-primary-subtle {
  border-color: #dee2e6;
}
.cursor-pointer {
  cursor: pointer;
}
.btn-white {
  background-color: #fff;
  color: #475569;
}
.btn-white:hover {
  background-color: #f8fafc;
  color: #1e293b;
}
</style>
