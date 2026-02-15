<template>
  <div class="auth-wrapper min-vh-100 d-flex align-items-center justify-content-center">
    <div class="auth-background"></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="login-card card border-0 shadow-lg overflow-hidden">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 64px; height: 64px;">
                  <i class="bi bi-robot fs-2"></i>
                </div>
                <h4 class="fw-bold text-dark">Welcome Back</h4>
                <p class="text-secondary small">Login to NUSA AI Admin Console</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label text-secondary fw-semibold small">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-envelope text-muted"></i></span>
                    <input 
                      v-model="email" 
                      type="email" 
                      class="form-control bg-light border-start-0 ps-0" 
                      placeholder="name@company.com" 
                      required
                    >
                  </div>
                </div>

                <div class="mb-4">
                  <div class="d-flex justify-content-between">
                    <label class="form-label text-secondary fw-semibold small">Password</label>
                    <a href="#" class="text-primary small text-decoration-none">Forgot?</a>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-lock text-muted"></i></span>
                    <input 
                      v-model="password" 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control bg-light border-start-0 ps-0 border-end-0" 
                      placeholder="••••••••" 
                      required
                    >
                    <button 
                      class="btn btn-light border border-start-0" 
                      type="button" 
                      @click="showPassword = !showPassword"
                    >
                      <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <div v-if="error" class="alert alert-danger py-2 small mb-4">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
                </button>

                <div class="text-center mt-4">
                  <p class="text-muted small mb-0">Demo: admin@nusaai.dev / admin123</p>
                </div>
              </form>
            </div>
            <div class="bg-primary py-3 text-center">
              <span class="text-white-50 small">© 2024 Nusa AI Development Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Explicitly set layout to false to avoid using default layout
definePageMeta({
  layout: false
});

const router = useRouter();

const email = ref('admin@nusaai.dev');
const password = ref('admin123');
const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

async function handleLogin() {
  loading.value = true;
  error.value = null;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email.value === 'admin@nusaai.dev' && password.value === 'admin123') {
      // Mock successful login
      router.push('/');
    } else {
      error.value = 'Invalid email or password';
    }
  } catch (err: any) {
    error.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
}

useHead({
  title: 'Login - AI Admin'
});
</script>

<style scoped>
.auth-wrapper {
  position: relative;
  overflow: hidden;
  background-color: #f3f4f6;
  z-index: 1;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%);
  opacity: 0.05;
  z-index: -1;
}

.auth-wrapper::before {
  content: "";
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
  top: -300px;
  right: -300px;
  border-radius: 50%;
  z-index: -1;
}

.auth-wrapper::after {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 70%);
  bottom: -200px;
  left: -200px;
  border-radius: 50%;
  z-index: -1;
}

.login-card {
  border-radius: 1.25rem;
  z-index: 2;
}

.input-group-text {
  border-color: #e5e7eb;
}

.form-control {
  border-color: #e5e7eb;
}

.form-control:focus {
  background-color: #fff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 0.25rem rgba(79, 70, 229, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4338ca 0%, #3733a3 100%);
  transform: translateY(-1px);
}
</style>
