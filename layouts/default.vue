<template>
  <div class="d-flex" id="wrapper" :class="{ 'toggled': isToggled }">
    <!-- Sidebar -->
    <Sidebar />
    <button
      v-if="isMobile"
      class="btn btn-white border-0"
      :class="{ 'is-open': isToggled }"
      id="mobileSidebarToggle"
      @click="toggleSidebar"
      aria-label="Toggle sidebar"
    >
      <i class="bi bi-list fs-4"></i>
    </button>
    <div
      v-if="isToggled && isMobile"
      class="sidebar-backdrop"
      @click="closeSidebar"
    ></div>

    <!-- Page Content -->
    <div id="page-content-wrapper" class="w-100 bg-light d-flex flex-column" style="min-height: 100vh;">
      <nav class="navbar navbar-expand-lg navbar-light sticky-top bg-white border-bottom">
        <div class="container-fluid d-flex align-items-center justify-content-between flex-nowrap">
          <div class="d-flex align-items-center flex-shrink-0">
             <button class="btn btn-white border-0 me-3 d-none d-md-inline-flex" id="sidebarToggle" @click="toggleSidebar">
                <i class="bi bi-list fs-4"></i>
            </button>
            <div class="d-none d-md-flex align-items-center me-auto">
              <!-- Sidebar toggle is sufficient for navigation -->
            </div>
          </div>
          <div class="d-flex align-items-center flex-shrink-0" id="navbarSupportedContent">
            <ul class="navbar-nav d-flex flex-row align-items-center mb-0">
              <li class="nav-item dropdown">
                <button
                  class="btn nav-link user-dropdown-toggle d-flex align-items-center p-0 border-0 bg-transparent"
                  id="navbarDropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff" class="rounded-circle avatar me-2" width="32" height="32" alt="Admin">
                  <span class="fw-medium text-dark d-none d-sm-inline">Admin User</span>
                  <i class="bi bi-caret-down-fill text-secondary extra-small ms-2"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item py-2 text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i> Logout</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="container-xl px-4 py-5 flex-grow-1 d-flex flex-column" style="max-width: 1200px; margin: 0 auto;">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue';

const isToggled = ref(false);
const isMobile = ref(false);

function toggleSidebar() {
    isToggled.value = !isToggled.value;
}

function closeSidebar() {
    isToggled.value = false;
}

function handleResize() {
    isMobile.value = window.innerWidth < 768;
    if (!isMobile.value) {
        isToggled.value = false;
    }
}

onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
#wrapper {
    overflow: hidden;
    height: 100vh;
    width: 100%;
}

#sidebar-wrapper {
    height: 100vh;
    margin-left: -260px;
    transition: margin .25s ease-out;
    z-index: 1050;
    flex-shrink: 0;
}

#page-content-wrapper {
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
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
        margin-left: -260px;
    }
}

@media (max-width: 767.98px) {
    #sidebar-wrapper {
        margin-left: -260px;
    }
    #wrapper.toggled #sidebar-wrapper {
        margin-left: 0;
    }
}

#sidebarToggle i {
    position: relative;
    left: -2px;
}

.navbar > .container-fluid {
    flex-wrap: nowrap;
}

#navbarSupportedContent .navbar-nav {
    flex-wrap: nowrap;
}

#navbarSupportedContent .dropdown {
    position: relative;
}

#navbarSupportedContent .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    left: auto;
}

.user-dropdown-toggle {
    white-space: nowrap;
}

.user-dropdown-toggle:focus,
.user-dropdown-toggle:active {
    box-shadow: none;
}

#mobileSidebarToggle {
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 1062;
    width: 40px;
    height: 40px;
    margin: 0 !important;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 8px;
    transition: left 0.25s ease;
}

#mobileSidebarToggle.is-open {
    left: 272px;
}

#mobileSidebarToggle:focus,
#mobileSidebarToggle:active {
    box-shadow: none;
    background-color: #fff;
}

@media (min-width: 768px) {
    #mobileSidebarToggle {
        display: none !important;
    }
}

.sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    z-index: 1040;
}
</style>
