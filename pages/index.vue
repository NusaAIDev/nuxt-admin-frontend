<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold text-dark mb-1">Dashboard</h3>
            <p class="text-secondary mb-0">Overview of your AI Chatbot System</p>
        </div>
        <div>
            <button class="btn btn-white border shadow-sm me-2"><i class="bi bi-download me-2"></i>Export Report</button>
            <button class="btn btn-primary shadow-sm"><i class="bi bi-plus-lg me-2"></i>New Campaign</button>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <!-- Card 1 -->
        <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">Total Customers</p>
                            <h2 class="fw-bold text-dark mb-0">{{ customerStore.totalCustomers }}</h2>
                        </div>
                        <div class="bg-primary-subtle text-primary rounded p-2">
                             <i class="bi bi-people fs-4"></i>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="badge bg-success-subtle text-success me-2"><i class="bi bi-arrow-up-short"></i> 12%</span>
                        <span class="text-secondary fs-7">from last month</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Card 2 -->
        <div class="col-md-4">
             <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">Active Conversations</p>
                            <h2 class="fw-bold text-dark mb-0">{{ customerStore.activeCustomers.length }}</h2>
                        </div>
                        <div class="bg-info-subtle text-info rounded p-2">
                             <i class="bi bi-chat-dots fs-4"></i>
                        </div>
                    </div>
                     <div class="d-flex align-items-center">
                        <span class="badge bg-success-subtle text-success me-2"><i class="bi bi-arrow-up-short"></i> 5%</span>
                        <span class="text-secondary fs-7">from last week</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Card 3 -->
        <div class="col-md-4">
             <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p class="text-secondary text-uppercase fw-bold fs-7 mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">System Health</p>
                            <h2 class="fw-bold text-dark mb-0">98%</h2>
                        </div>
                        <div class="bg-success-subtle text-success rounded p-2">
                             <i class="bi bi-activity fs-4"></i>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="badge bg-success-subtle text-success me-2">Stable</span>
                        <span class="text-secondary fs-7">All systems operational</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-12">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Recent Activity</h5>
                    <button class="btn btn-sm btn-light border">View All</button>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">Action</th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="ps-4"><i class="bi bi-person-plus text-primary me-2"></i> New Customer Added</td>
                                    <td>Admin User</td>
                                    <td>Today, 10:23 AM</td>
                                    <td><span class="badge bg-success-subtle text-success">Completed</span></td>
                                </tr>
                                 <tr>
                                    <td class="ps-4"><i class="bi bi-database-add text-info me-2"></i> Knowledge Updated</td>
                                    <td>System</td>
                                    <td>Yesterday, 4:15 PM</td>
                                    <td><span class="badge bg-success-subtle text-success">Completed</span></td>
                                </tr>
                                <tr>
                                    <td class="ps-4"><i class="bi bi-exclamation-circle text-warning me-2"></i> Failed Login Attempt</td>
                                    <td>Unknown</td>
                                    <td>Yesterday, 2:00 AM</td>
                                    <td><span class="badge bg-danger-subtle text-danger">Failed</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer';

const customerStore = useCustomerStore();

// Setup page meta
useHead({
  title: 'Dashboard - AI Admin'
});

onMounted(() => {
    customerStore.fetchCustomers();
});
</script>
