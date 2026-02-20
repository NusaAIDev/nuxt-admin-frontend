<template>
  <div class="row g-4 mb-4">
    <div v-for="card in cards" :key="card.label" class="col-6 col-md-3">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div 
              class="rounded-circle d-flex align-items-center justify-content-center" 
              :class="card.bgClass"
              style="width: 42px; height: 42px"
            >
              <i :class="[card.icon, card.textClass]" class="fs-5"></i>
            </div>
            <span v-if="card.trend" class="extra-small fw-bold" :class="card.trend > 0 ? 'text-success' : 'text-danger'">
              <i class="bi" :class="card.trend > 0 ? 'bi-arrow-up-short' : 'bi-arrow-down-short'"></i>
              {{ Math.abs(card.trend) }}%
            </span>
          </div>
          <h6 class="text-secondary fw-semibold mb-1">{{ card.label }}</h6>
          <h3 class="fw-bold text-dark mb-0">{{ formatNumber(card.value) }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cards: Array<{
    label: string;
    value: number;
    icon: string;
    bgClass: string;
    textClass: string;
    trend?: number;
  }>
}>();

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};
</script>

<style scoped>
.extra-small {
  font-size: 0.75rem;
}
</style>
