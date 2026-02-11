<template>
  <div class="d-flex" id="wrapper" :class="{ 'toggled': isToggled }">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Page Content -->
    <div id="page-content-wrapper" class="w-100 bg-light">
      <nav class="navbar navbar-expand-lg navbar-light sticky-top">
        <div class="container-fluid">
          <div class="d-flex align-items-center">
             <button class="btn btn-light shadow-sm me-3 border" id="sidebarToggle" @click="toggleSidebar">
                <i class="bi bi-list fs-5"></i>
            </button>
            <h5 class="mb-0 text-muted d-none d-md-block">Admin Console</h5>
          </div>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mt-2 mt-lg-0 align-items-center">
              <li class="nav-item me-3">
                  <a href="#" class="nav-link position-relative text-secondary">
                      <i class="bi bi-bell fs-5"></i>
                      <span class="position-absolute top-2 start-75 translate-middle p-1 bg-danger border border-light rounded-circle">
                        <span class="visually-hidden">New alerts</span>
                      </span>
                  </a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff" class="rounded-circle avatar me-2" width="32" height="32" alt="Admin">
                  <span class="fw-medium text-dark">Admin User</span>
                </a>
                <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item py-2" href="#"><i class="bi bi-person me-2 text-muted"></i> Profile</a>
                  <a class="dropdown-item py-2" href="#"><i class="bi bi-gear me-2 text-muted"></i> Settings</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item py-2 text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i> Logout</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="container-fluid p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue';

const isToggled = ref(false);

function toggleSidebar() {
    isToggled.value = !isToggled.value;
}
</script>

<style scoped>
#wrapper {
    overflow-x: hidden;
    min-height: 100vh;
}

#sidebar-wrapper {
    min-height: 100vh;
    margin-left: -15rem;
    transition: margin .25s ease-out;
    z-index: 1000;
}

#sidebar-wrapper .sidebar-heading {
    padding: 0.875rem 1.25rem;
    font-size: 1.2rem;
}

#wrapper.toggled #sidebar-wrapper {
    margin-left: 0;
}

@media (min-width: 768px) {
    #sidebar-wrapper {
        margin-left: 0;
    }

    #page-content-wrapper {
        min-width: 0;
        width: 100%;
    }

    #wrapper.toggled #sidebar-wrapper {
        margin-left: -15rem;
    }
}

@media (max-width: 767.98px) {
    #sidebar-wrapper {
        margin-left: -15rem;
    }
    #wrapper.toggled #sidebar-wrapper {
        margin-left: 0;
    }
}
</style>
