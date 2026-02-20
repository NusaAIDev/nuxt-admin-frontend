import { useCustomerStore } from '~/stores/customer';

export default defineNuxtRouteMiddleware((to) => {
    const customerStore = useCustomerStore();
    const customerId = to.params.id as string;

    if (customerId) {
        if (customerStore.selectedCustomerId !== customerId) {
            customerStore.selectCustomer(customerId);
        }
    }
});
