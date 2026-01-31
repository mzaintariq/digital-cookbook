<template>
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
    <div v-if="show" :class="[
      'fixed top-4 right-4 z-50 text-paper-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]',
      type === 'error' ? 'bg-error-600' : 'bg-success-600'
    ]">
      <IconClose v-if="type === 'error'" class="w-5 h-5 flex-shrink-0" />
      <IconCheck v-else class="w-5 h-5 flex-shrink-0" />
      <span class="flex-1">{{ message }}</span>
      <button @click="show = false" class="text-paper-50 hover:text-ink-200 flex-shrink-0">
        <IconClose class="w-5 h-5" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">

import IconClose from '~/components/icons/IconClose.vue'
import IconCheck from '~/components/icons/IconCheck.vue'

const show = ref(false)
const message = ref('')
const type = ref<'success' | 'error'>('success')

function showNotification(msg: string, notificationType: 'success' | 'error' = 'success') {
  message.value = msg
  type.value = notificationType
  show.value = true

  // Auto-hide after 3 seconds
  setTimeout(() => {
    show.value = false
  }, 3000)
}

onMounted(() => {
  window.addEventListener('recipe-saved', ((e: CustomEvent) => {
    showNotification(e.detail.message || 'Recipe saved successfully!', e.detail.type || 'success')
  }) as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('recipe-saved', () => { })
})
</script>
