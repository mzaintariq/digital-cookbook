<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-40 md:hidden" @click="$emit('update:modelValue', false)">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70" aria-hidden="true" />
        <div class="pwa-safe-mobile-menu absolute top-0 right-0 bottom-0 w-full max-w-xs bg-paper-50 dark:bg-paper-950 shadow-xl flex flex-col" @click.stop>
          <div class="flex items-center justify-between h-16 px-4 border-b border-paper-300 dark:border-paper-800">
            <span class="text-sm font-medium text-ink-600 dark:text-paper-300">Menu</span>
            <button @click="$emit('update:modelValue', false)"
              class="w-10 h-10 flex items-center justify-center text-ink-600 dark:text-paper-300 hover:text-ink-800 dark:hover:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800 rounded-full"
              aria-label="Close menu">
              <IconClose class="w-5 h-5" />
            </button>
          </div>
          <nav class="flex flex-col py-4">
            <ThemeToggle show-label class="mx-2 mb-2 !w-auto" />
            <!-- <NuxtLink to="/" class="px-4 py-3 text-ink-800 dark:text-paper-100 hover:bg-paper-50 dark:hover:bg-paper-800 font-medium"
              @click="$emit('update:modelValue', false)">
              Recipes
            </NuxtLink> -->
            <template v-if="isLoggedIn">
              <NuxtLink to="/admin/recipes/new" class="px-4 py-3 text-ink-800 dark:text-paper-100 hover:bg-paper-50 dark:hover:bg-paper-800"
                @click="$emit('update:modelValue', false)">
                Add Recipe
              </NuxtLink>
              <NuxtLink to="/admin/recipes" class="px-4 py-3 text-ink-800 dark:text-paper-100 hover:bg-paper-50 dark:hover:bg-paper-800"
                @click="$emit('update:modelValue', false)">
                Recipe List
              </NuxtLink>
              <button @click="$emit('logout')" class="px-4 py-3 text-left text-ink-800 dark:text-paper-100 hover:bg-paper-50 dark:hover:bg-paper-800 w-full">
                Logout
              </button>
            </template>
            <NuxtLink v-else to="/admin/login" class="px-4 py-3 text-ink-800 dark:text-paper-100 hover:bg-paper-50 dark:hover:bg-paper-800 flex items-center gap-2"
              @click="$emit('update:modelValue', false)">
              <IconUser class="w-5 h-5" />
              Login
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import IconClose from '~/components/icons/IconClose.vue'
import IconUser from '~/components/icons/IconUser.vue'

defineProps<{
  modelValue: boolean
  isLoggedIn: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  logout: []
}>()
</script>
