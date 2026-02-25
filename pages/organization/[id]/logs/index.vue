<script setup lang="ts">
const route = useRoute();
await navigateTo(`/organization/${route.params.id as string}/logs/webhook`, {
  replace: true,
});
</script>
