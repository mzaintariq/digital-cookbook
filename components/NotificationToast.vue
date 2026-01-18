<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]"
    >
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="flex-1">{{ message }}</span>
      <button
        @click="show = false"
        class="text-white hover:text-gray-200 flex-shrink-0"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const show = ref(false)
const message = ref('')

function showNotification(msg: string) {
  message.value = msg
  show.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    show.value = false
  }, 3000)
}

onMounted(() => {
  window.addEventListener('recipe-saved', ((e: CustomEvent) => {
    showNotification(e.detail.message || 'Recipe saved successfully!')
  }) as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('recipe-saved', () => {})
})
</script>

