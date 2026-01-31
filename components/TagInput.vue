<template>
  <div>
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-ink-800 mb-1">
      {{ label }}
    </label>
    <div :class="[
      'flex flex-wrap items-center gap-2 min-h-[2.5rem] px-3 py-2 border rounded-md focus-within:outline-none focus-within:ring-2 transition-colors',
      hasError
        ? 'border-error-600 focus-within:ring-error-600 focus-within:border-error-600 bg-error-50'
        : 'border-paper-400 focus-within:ring-brand-primary'
    ]" @click="focusInput">
      <!-- Tag chips -->
      <div v-for="(tag, index) in tagList" :key="index"
        class="flex items-center gap-1 px-2 py-1 bg-brand-primary-100 text-brand-primary-800 rounded text-sm">
        <span>{{ tag }}</span>
        <button type="button" @click.stop="removeTag(index)"
          class="ml-1 text-brand-primary-800 hover:text-brand-primary-900 focus:outline-none">
          <IconClose class="w-3 h-3" />
        </button>
      </div>
      <!-- Input field -->
      <input :id="inputId" ref="inputRef" v-model="inputValue" type="text"
        :placeholder="tagList.length === 0 ? placeholder : ''"
        class="flex-1 min-w-[120px] outline-none bg-transparent text-sm" @keydown="handleKeydown"
        @input="handleInput" />
    </div>
    <p v-if="errorMessage" class="mt-1 text-sm text-error-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import IconClose from '~/components/icons/IconClose.vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  errorMessage?: string
  inputId?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Type and press Enter to add tags',
  inputId: 'tags'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')

// Parse tags from comma-separated string
const tagList = computed(() => {
  if (!props.modelValue || !props.modelValue.trim()) return []
  return props.modelValue.split(',').map(t => t.trim()).filter(t => t.length > 0)
})

const hasError = computed(() => !!props.errorMessage)

// Update input when modelValue changes externally
watch(() => props.modelValue, (newVal) => {
  // Only update if the change didn't come from our input
  if (newVal !== tagList.value.join(', ')) {
    inputValue.value = ''
  }
})

function focusInput() {
  inputRef.value?.focus()
}

function addTags(newTags: string[]) {
  const currentTags = tagList.value
  const tagsToAdd = newTags
    .map(t => t.trim())
    .filter(t => t.length > 0 && !currentTags.includes(t))

  if (tagsToAdd.length > 0) {
    const allTags = [...currentTags, ...tagsToAdd]
    emit('update:modelValue', allTags.join(', '))
  }
}

function addTag(tag: string) {
  addTags([tag])
  inputValue.value = ''
}

function removeTag(index: number) {
  const newTags = tagList.value.filter((_, i) => i !== index)
  emit('update:modelValue', newTags.join(', '))
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (inputValue.value.trim()) {
      // Handle comma-separated input - add all tags at once
      const tags = inputValue.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
      addTags(tags)
      inputValue.value = ''
    }
  } else if (event.key === 'Backspace' && inputValue.value === '' && tagList.value.length > 0) {
    // Remove last tag when backspace is pressed on empty input
    removeTag(tagList.value.length - 1)
  }
}

function handleInput() {
  // Allow typing, tags are added on Enter
}
</script>
