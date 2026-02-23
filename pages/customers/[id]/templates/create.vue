<script setup lang="ts">
const route = useRoute();
const customerId = route.params.id as string;

await navigateTo(`/organization/${customerId}/templates`);
</script>

<template>
  <div></div>
</template>
