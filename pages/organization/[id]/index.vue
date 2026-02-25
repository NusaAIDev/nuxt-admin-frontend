<script setup lang="ts">
definePageMeta({
  redirect: (to) => `/organization/${to.params.id as string}/wabas`,
});
</script>
