<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">AI Behavior</h4>
        <p class="text-secondary small mb-0">
          Configure the global AI persona and model settings
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <form @submit.prevent>
              <div class="mb-4">
                <label for="systemPrompt" class="form-label fw-bold"
                  >System Prompt</label
                >
                <textarea
                  class="form-control bg-light border-0"
                  id="systemPrompt"
                  rows="6"
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
                    />
                    <span class="badge bg-light text-dark border">0.7</span>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <label for="model" class="form-label fw-bold">Model</label>
                  <select class="form-select bg-light border-0" id="model">
                    <option selected>GPT-4o</option>
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
                />
                <label class="form-check-label fw-medium" for="webSearch"
                  >Enable Web Search</label
                >
              </div>

              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary px-4">
                  <i class="bi bi-check-lg me-2"></i>Save Changes
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

<script setup lang="ts"></script>
