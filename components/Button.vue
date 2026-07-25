<template>
  <button :type="type" :disabled="disabled" :class="mergedClasses" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'reverse-primary' | 'dashed' | 'delete'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  size: 'sm',
  class: ''
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses = {
  primary: 'border border-transparent bg-brand-primary text-paper-50 hover:bg-brand-primary-600 disabled:bg-paper-400 dark:disabled:bg-paper-700 disabled:cursor-not-allowed',
  secondary: 'bg-paper-200 dark:bg-paper-800 text-ink-800 dark:text-paper-100 hover:bg-paper-300 dark:hover:bg-paper-700',
  'reverse-primary': 'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-paper-50',
  dashed: 'border border-dashed border-paper-400 dark:border-paper-700 text-ink-700 dark:text-paper-200 enabled:hover:bg-paper-50 dark:enabled:hover:bg-paper-800 enabled:hover:border-brand-primary-400 enabled:hover:text-brand-primary',
  delete: 'bg-paper-50 dark:bg-paper-900 border border-error-300 dark:border-error-800 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950'
}

const baseClasses = computed(() => [
  'rounded-md font-medium transition-colors',
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.disabled && 'opacity-50 cursor-not-allowed'
].filter(Boolean).join(' '))

const mergedClasses = computed(() => {
  return props.class ? `${baseClasses.value} ${props.class}` : baseClasses.value
})
</script>
