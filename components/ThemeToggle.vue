<template>
  <button
    type="button"
    :aria-label="accessibleLabel"
    :aria-pressed="isDark"
    :class="[
      'min-h-11 min-w-11 rounded-full flex items-center justify-center gap-3 text-ink-800 dark:text-paper-100',
      'hover:bg-paper-100 dark:hover:bg-paper-800 focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper-50',
      'dark:focus-visible:ring-offset-paper-950',
      showLabel ? 'w-full px-4 justify-start rounded-lg' : '',
    ]"
    @click="toggleTheme"
  >
    <svg
      v-if="isDark"
      class="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
    <svg
      v-else
      class="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
    <span v-if="showLabel">{{ accessibleLabel }}</span>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  showLabel?: boolean
}>(), {
  showLabel: false,
})

const { isDark, toggleTheme } = useTheme()
const accessibleLabel = computed(() =>
  isDark.value ? 'Switch to light mode' : 'Switch to dark mode'
)
const showLabel = computed(() => props.showLabel)
</script>
