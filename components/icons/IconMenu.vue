<template>
  <svg :class="iconClass" :width="size" :height="size" fill="none" stroke="currentColor" viewBox="0 0 24 24"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 24,
  },
  iconClass: {
    type: String,
    default: '',
  },
})
</script>
