<template>
  <button type="button" role="checkbox" :aria-checked="isIndeterminate ? 'mixed' : checked" :disabled="disabled"
    :class="checkboxClasses" @click="handleClick">
    <IconIndeterminate v-if="isIndeterminate" :size="iconSize" :icon-class="iconClasses" />
    <IconCheck v-else-if="checked" :size="iconSize" :icon-class="iconClasses" />
  </button>
</template>

<script setup lang="ts">
import IconCheck from '~/components/icons/IconCheck.vue'
import IconIndeterminate from '~/components/icons/IconIndeterminate.vue'

interface Props {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  size?: 'default' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
  checked: false,
  indeterminate: false,
  disabled: false,
  size: 'default'
})

const emit = defineEmits<{
  'update:checked': [value: boolean]
  'change': [event: Event]
}>()

const isIndeterminate = computed(() => props.indeterminate)

const sizeClasses = {
  default: 'h-5 w-5',
  small: 'h-4 w-4'
}

const iconSizes = {
  default: 10, // 0.625rem = 10px
  small: 12 // 0.75rem = 12px
}

const checkboxClasses = computed(() => [
  'shrink-0 rounded border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 flex items-center justify-center',
  sizeClasses[props.size],
  props.disabled
    ? 'cursor-not-allowed opacity-50 bg-paper-100 border-paper-400'
    : 'cursor-pointer',
  isIndeterminate.value || props.checked
    ? 'bg-brand-primary border-brand-primary text-paper-50'
    : 'bg-transparent border-paper-400 text-transparent hover:border-brand-primary',
].filter(Boolean).join(' '))

const iconSize = computed(() => iconSizes[props.size])

const iconClasses = computed(() => 'stroke-current')

function handleClick(event: MouseEvent) {
  if (props.disabled) return

  const newValue = props.indeterminate ? true : !props.checked
  emit('update:checked', newValue)

  // Create a synthetic change event compatible with TanStack table
  const syntheticEvent = {
    target: { checked: newValue },
    currentTarget: { checked: newValue },
    preventDefault: () => { },
    stopPropagation: () => event.stopPropagation()
  } as any

  emit('change', syntheticEvent)
}
</script>
