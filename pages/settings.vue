<template>
  <div>
    <h2>System Settings</h2>
    <div class="row mt-4">
        <div class="col-md-8">
            <div class="card mb-4">
                <div class="card-header bg-white">
                    <h5 class="mb-0">WhatsApp Integration</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Meta API Key</label>
                        <input type="password" class="form-control" value="************************">
                    </div>
                     <div class="mb-3">
                        <label class="form-label">Phone Number ID</label>
                        <input type="text" class="form-control" value="1002030405060">
                    </div>
                    <button class="btn btn-outline-primary btn-sm">Test Connection</button>
                </div>
            </div>

             <div class="card mb-4">
                <div class="card-header bg-white">
                    <h5 class="mb-0">AI Provider</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Provider</label>
                        <select class="form-select">
                            <option>OpenAI</option>
                            <option>Anthropic</option>
                            <option>Google Gemini</option>
                        </select>
                    </div>
                     <div class="mb-3">
                        <label class="form-label">API Key</label>
                        <input type="password" class="form-control" value="sk-........................">
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
