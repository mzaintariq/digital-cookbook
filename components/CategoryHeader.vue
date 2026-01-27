<template>
  <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 h-8">
    <div class="flex items-center gap-2 flex-1">
      <div v-if="!isEditing" :class="dragHandleClass" class="cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0">
        <IconDragHandle class="w-4 h-4" />
      </div>
      <input v-if="isEditing" v-model="localEditValue" type="text"
        @keyup.enter="handleSave"
        @keyup.esc="handleCancel"
        @blur="handleSave"
        class="px-2 py-1 text-sm font-semibold border border-brand-primary rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
        autofocus />
      <h3 v-else class="text-sm font-semibold text-gray-900 uppercase">{{ category }}</h3>
    </div>
    <div class="flex items-center gap-2">
      <button type="button" 
        v-if="!isEditing"
        @click="$emit('edit')"
        class="text-xs text-gray-500 hover:text-gray-700">
        Edit
      </button>
      <button type="button" 
        v-else
        @click="handleSave"
        class="text-xs text-brand-primary hover:text-brand-primary-600">
        Done
      </button>
      <button type="button" @click="$emit('delete')"
        class="text-red-500 hover:text-red-700">
        <IconClose class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import IconDragHandle from '~/components/icons/IconDragHandle.vue'
import IconClose from '~/components/icons/IconClose.vue'

interface Props {
  category: string
  isEditing: boolean
  dragHandleClass?: string
  editValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  dragHandleClass: '',
  editValue: ''
})

const emit = defineEmits<{
  edit: []
  'update:edit-value': [value: string]
  save: [newName: string]
  cancel: []
  delete: []
}>()

const localEditValue = ref(props.editValue || props.category)

watch(() => props.category, (newVal) => {
  if (!props.isEditing) {
    localEditValue.value = newVal
  }
})

watch(() => props.isEditing, (isEditing) => {
  if (isEditing) {
    localEditValue.value = props.editValue || props.category
  }
})

watch(() => props.editValue, (newVal) => {
  if (props.isEditing && newVal) {
    localEditValue.value = newVal
  }
})

function handleSave() {
  emit('update:edit-value', localEditValue.value)
  emit('save', localEditValue.value)
}

function handleCancel() {
  localEditValue.value = props.category
  emit('cancel')
}
</script>

