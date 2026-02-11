<template>
  <div>
    <h4>AI Configuration</h4>
    <div class="row">
        <div class="col-md-8">
            <form @submit.prevent>
                <div class="mb-3">
                    <label for="systemPrompt" class="form-label">System Prompt</label>
                    <textarea class="form-control" id="systemPrompt" rows="6" placeholder="You are a helpful assistant..."></textarea>
                    <div class="form-text">Define the persona and behavioral rules for the AI.</div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="temperature" class="form-label">Temperature (Creativity)</label>
                        <input type="range" class="form-range" id="temperature" min="0" max="1" step="0.1">
                    </div>
                    <div class="col-md-6 mb-3">
                         <label for="model" class="form-label">Model</label>
                         <select class="form-select" id="model">
                             <option selected>GPT-4o</option>
                             <option>GPT-3.5 Turbo</option>
                             <option>Claude 3.5 Sonnet</option>
                         </select>
                    </div>
                </div>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="webSearch">
                    <label class="form-check-label" for="webSearch">Enable Web Search</label>
                </div>

                <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
