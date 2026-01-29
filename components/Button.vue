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
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  'reverse-primary': 'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
  dashed: 'border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50',
  delete: 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
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
