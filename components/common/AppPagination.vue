<template>
  <div
    v-if="totalItems > 0"
    class="app-pagination d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 border-top bg-white"
  >
    <div class="text-secondary small">
      Showing {{ resolvedStartItem }}-{{ resolvedEndItem }} of {{ totalItems }}
    </div>

    <div v-if="showPerPageSelector" class="d-flex align-items-center gap-2">
      <label class="small text-secondary mb-0">Rows</label>
      <select
        class="form-select form-select-sm pagination-select"
        :value="perPage"
        @change="updatePerPageFromEvent"
      >
        <option
          v-for="option in normalizedPerPageOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>

    <nav aria-label="Pagination">
      <ul class="pagination pagination-sm mb-0 d-flex list-unstyled">
        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)">Prev</button>
        </li>
        <li
          v-for="page in visiblePages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage >= resolvedTotalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    totalItems: number;
    currentPage: number;
    perPage: number;
    totalPages?: number;
    startItem?: number;
    endItem?: number;
    perPageOptions?: number[];
    maxVisiblePages?: number;
  }>(),
  {
    perPageOptions: () => [],
    maxVisiblePages: 5,
  },
);

const emit = defineEmits<{
  (e: "update:currentPage", page: number): void;
  (e: "update:perPage", perPage: number): void;
}>();

const normalizedPerPageOptions = computed(() => {
  const options = props.perPageOptions.length
    ? props.perPageOptions
    : [props.perPage];
  return Array.from(new Set(options)).sort((a, b) => a - b);
});

const showPerPageSelector = computed(() => normalizedPerPageOptions.value.length > 1);

const resolvedTotalPages = computed(() =>
  props.totalPages && props.totalPages > 0
    ? props.totalPages
    : Math.max(1, Math.ceil(props.totalItems / Math.max(1, props.perPage))),
);

const resolvedStartItem = computed(() => {
  if (props.startItem && props.startItem > 0) return props.startItem;
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.perPage + 1;
});

const resolvedEndItem = computed(() => {
  if (props.endItem && props.endItem > 0) return props.endItem;
  return Math.min(props.currentPage * props.perPage, props.totalItems);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const half = Math.floor(props.maxVisiblePages / 2);
  let start = Math.max(1, props.currentPage - half);
  const end = Math.min(resolvedTotalPages.value, start + props.maxVisiblePages - 1);
  start = Math.max(1, end - props.maxVisiblePages + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

watch(
  () => [props.currentPage, resolvedTotalPages.value],
  () => {
    if (props.currentPage > resolvedTotalPages.value) {
      emit("update:currentPage", resolvedTotalPages.value);
    }
    if (props.currentPage < 1) {
      emit("update:currentPage", 1);
    }
  },
  { immediate: true },
);

function goToPage(page: number) {
  const nextPage = Math.min(Math.max(page, 1), resolvedTotalPages.value);
  emit("update:currentPage", nextPage);
}

function updatePerPage(value: string) {
  const nextPerPage = Number(value);
  emit("update:perPage", nextPerPage);
  emit("update:currentPage", 1);
}

function updatePerPageFromEvent(event: Event) {
  const target = event.target as HTMLSelectElement | null;
  if (!target) return;
  updatePerPage(target.value);
}
</script>

<style scoped>
.app-pagination .pagination {
  --bs-pagination-padding-x: 0.65rem;
  --bs-pagination-padding-y: 0.25rem;
  --bs-pagination-font-size: 0.82rem;
  --bs-pagination-color: #475569;
  --bs-pagination-bg: #ffffff;
  --bs-pagination-border-color: #dbe3ee;
  --bs-pagination-hover-color: #1e293b;
  --bs-pagination-hover-bg: #f8fafc;
  --bs-pagination-hover-border-color: #cbd5e1;
  --bs-pagination-focus-color: #1e293b;
  --bs-pagination-focus-bg: #eef2ff;
  --bs-pagination-focus-box-shadow: none;
  --bs-pagination-active-color: #ffffff;
  --bs-pagination-active-bg: #4f46e5;
  --bs-pagination-active-border-color: #4f46e5;
  --bs-pagination-disabled-color: #94a3b8;
  --bs-pagination-disabled-bg: #f8fafc;
  --bs-pagination-disabled-border-color: #e2e8f0;
}

.app-pagination .page-link {
  border-radius: 0.35rem;
}

.pagination-select {
  min-width: 74px;
}
</style>
