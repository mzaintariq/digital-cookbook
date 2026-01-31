<template>
  <div class="flex items-start gap-2 p-3 border border-paper-300 rounded-lg bg-paper-50">
    <div class="drag-handle cursor-move pt-2 text-ink-500 hover:text-ink-700 flex-shrink-0">
      <IconDragHandle class="w-5 h-5" />
    </div>
    <div class="flex-1 space-y-2">
      <div class="flex items-start gap-2">
        <span class="text-sm font-medium text-ink-800 pt-2 flex-shrink-0">{{ String(index + 1).padStart(2, '0')
          }}</span>
        <textarea v-model="step.description" rows="2" placeholder="eg: Preheat your oven to 375°F (190°C)..."
          class="flex-1 px-3 py-2 text-sm border border-paper-400 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
        <button type="button" @click="$emit('remove')" class="pt-2 text-error-500 hover:text-error-700 flex-shrink-0">
          <IconTrash class="w-5 h-5" />
        </button>
      </div>

      <!-- Sub-steps -->
      <div v-if="step.subSteps && step.subSteps.length > 0" class="ml-6 space-y-2">
        <draggable v-model="step.subSteps" item-key="id" handle=".drag-handle" :animation="200" :force-fallback="true"
          ghost-class="sortable-ghost" chosen-class="sortable-chosen" drag-class="sortable-drag" class="space-y-2">
          <template #item="{ element: subStep, index: subIndex }">
            <div class="flex items-start gap-2 p-2 border border-paper-300 rounded bg-white">
              <div class="drag-handle cursor-move pt-1 text-ink-500 hover:text-ink-700 flex-shrink-0">
                <IconDragHandle class="w-4 h-4" />
              </div>
              <span class="text-xs font-medium text-ink-700 pt-1 flex-shrink-0">{{ String.fromCharCode(97 + subIndex)
                }}</span>
              <textarea v-model="subStep.description" rows="1" placeholder="Sub-step description..."
                class="flex-1 px-2 py-1 text-xs border border-paper-400 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
              <button type="button" @click="$emit('remove-sub-step', subIndex)"
                class="pt-1 text-error-500 hover:text-error-700 flex-shrink-0">
                <IconTrash class="w-4 h-4" />
              </button>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Add Sub-step button -->
      <button type="button" @click="$emit('add-sub-step')"
        class="ml-6 text-xs text-ink-600 hover:text-ink-800 flex items-center gap-1">
        <IconPlus class="w-3 h-3" />
        Add sub-step
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import IconDragHandle from '~/components/icons/IconDragHandle.vue'
import IconTrash from '~/components/icons/IconTrash.vue'
import IconPlus from '~/components/icons/IconPlus.vue'

interface SubStep {
  id: string
  description: string
}

interface Step {
  id: string
  description: string
  category?: string | null
  subSteps?: SubStep[]
}

interface Props {
  step: Step
  index: number
}

defineProps<Props>()

defineEmits<{
  remove: []
  'add-sub-step': []
  'remove-sub-step': [subStepIndex: number]
}>()
</script>
