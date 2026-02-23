<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">AI Behavior</h4>
        <p class="text-secondary small mb-0">
          Configure the global AI persona and model settings
        </p>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span
          class="badge text-uppercase px-3 py-2"
          :class="isEditing ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'"
        >
          {{ isEditing ? "Edit Mode" : "View Mode" }}
        </span>
        <template v-if="!isEditing">
          <button class="btn btn-outline-primary" @click="isEditing = true">
            <i class="bi bi-pencil-square me-1"></i> Edit
          </button>
        </template>
        <template v-else>
          <button class="btn btn-primary" @click="saveChanges" :disabled="saving">
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Save Changes
          </button>
          <button class="btn btn-light border" @click="cancelEdit" :disabled="saving">
            Cancel
          </button>
        </template>
      </div>
    </div>

    <div class="alert py-2 mb-4" :class="isEditing ? 'alert-warning' : 'alert-secondary'">
      {{ isEditing
        ? "Editing aktif. Perubahan akan disimpan saat klik Save Changes."
        : "Read-only mode. Klik Edit untuk mengubah konfigurasi AI." }}
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <form @submit.prevent="saveChanges">
              <div class="mb-4">
                <label for="systemPrompt" class="form-label fw-bold"
                  >System Prompt</label
                >
                <textarea
                  class="form-control"
                  id="systemPrompt"
                  rows="6"
                  v-model="form.systemPrompt"
                  :readonly="!isEditing"
                  placeholder="You are a helpful assistant..."
                ></textarea>
                <div class="form-text mt-2">
                  Define the persona and behavioral rules for the AI.
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-4">
                  <label for="temperature" class="form-label fw-bold"
                    >Temperature (Creativity)</label
                  >
                  <div class="d-flex align-items-center gap-3">
                    <input
                      type="range"
                      class="form-range"
                      id="temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      v-model.number="form.temperature"
                      :disabled="!isEditing"
                    />
                    <span class="badge bg-light text-dark border">{{ form.temperature.toFixed(1) }}</span>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <label for="model" class="form-label fw-bold">Model</label>
                  <select class="form-select" id="model" v-model="form.model" :disabled="!isEditing">
                    <option>GPT-4o</option>
                    <option>GPT-3.5 Turbo</option>
                    <option>Claude 3.5 Sonnet</option>
                  </select>
                </div>
              </div>

              <div class="form-check form-switch mb-4">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="webSearch"
                  v-model="form.webSearch"
                  :disabled="!isEditing"
                />
                <label class="form-check-label fw-medium" for="webSearch"
                  >Enable Web Search</label
                >
              </div>

              <div class="d-flex justify-content-end" v-if="isEditing">
                <button type="submit" class="btn btn-primary px-4">
                  <span
                    v-if="saving"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <i v-else class="bi bi-check-lg me-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm bg-info bg-opacity-10 p-4">
          <h6 class="fw-bold text-info mb-2 small text-uppercase">
            <i class="bi bi-info-circle me-2"></i>Pro Tip
          </h6>
          <p class="text-info-emphasis small opacity-75 mb-0">
            High temperature values (0.8+) make the AI more creative but less
            predictable. For customer support, we recommend keeping it between
            0.3 and 0.5.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isEditing = ref(false);
const saving = ref(false);

type AiConfigForm = {
  systemPrompt: string;
  temperature: number;
  model: string;
  webSearch: boolean;
};

const form = reactive<AiConfigForm>({
  systemPrompt: "You are a helpful assistant for WhatsApp customer support.",
  temperature: 0.7,
  model: "GPT-4o",
  webSearch: false,
});

const originalForm = ref<AiConfigForm>({ ...form });

function cancelEdit() {
  Object.assign(form, originalForm.value);
  isEditing.value = false;
}

async function saveChanges() {
  if (!isEditing.value || saving.value) {
    return;
  }

  saving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 350));
    originalForm.value = { ...form };
    isEditing.value = false;
  } finally {
    saving.value = false;
  }
}
</script>
