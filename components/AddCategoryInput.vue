<template>
  <div class="flex gap-2 h-8">
    <Button v-if="!showInput" type="button" @click="$emit('show')" variant="reverse-primary" size="xs">
      + Add Category
    </Button>
    <div v-else class="flex gap-2">
      <input v-model="localValue" type="text" :placeholder="placeholder" @keyup.enter="handleAdd"
        @keyup.esc="handleCancel"
        class="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
        autofocus />
      <Button type="button" @click="handleAdd" variant="primary" size="xs">
        Add
      </Button>
      <Button type="button" @click="handleCancel" variant="secondary" size="xs">
        Cancel
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '~/components/Button.vue'

interface Props {
  showInput: boolean
  value: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Category name'
})

const emit = defineEmits<{
  show: []
  'update:value': [value: string]
  add: []
  cancel: []
}>()

const localValue = ref(props.value)

watch(() => props.value, (newVal) => {
  localValue.value = newVal
})

watch(() => props.showInput, (isShowing) => {
  if (isShowing) {
    localValue.value = props.value
  }
})

function handleAdd() {
  emit('update:value', localValue.value)
  emit('add')
}

function handleCancel() {
  localValue.value = props.value
  emit('cancel')
}
</script>
