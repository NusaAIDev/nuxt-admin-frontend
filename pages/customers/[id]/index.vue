<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;
navigateTo(`/customers/${id}/waba-overview`);
</script>
