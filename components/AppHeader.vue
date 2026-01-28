<template>
  <header class="bg-white border-b border-gray-200 h-16">
    <div class="container mx-auto px-4 h-full">
      <div class="flex items-center justify-between h-full">
        <!-- Logo or Recipe Title -->
        <NuxtLink v-if="!isRecipeEditPage" to="/"
          class="group flex items-center gap-1 text-brand-primary transition-colors duration-200 hover:text-brand-primary-600"
          aria-label="Digital Cookbook home">
          <!-- hover:opacity-80" -->
          <LogoIcon class="h-10 w-10 shrink-0" aria-hidden />
          <LogoType class="h-8 w-auto max-w-[140px] shrink-0" aria-hidden />
        </NuxtLink>
        <div v-else class="flex items-center gap-3">
          <button @click="handleBack"
            class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
            <IconClose class="w-5 h-5 text-gray-700" />
          </button>
          <span class="text-gray-900 font-semibold text-lg">
            {{ saveButtonText === 'Save Recipe' ? 'New Recipe' : (recipeTitle || 'Edit Recipe') }}
          </span>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center gap-6">
          <NuxtLink v-if="!isRecipeEditPage" to="/recipes" class="text-gray-700 hover:text-gray-900 font-medium">
            Recipes
          </NuxtLink>

          <!-- Recipe Edit Page Actions -->
          <div v-if="isRecipeEditPage" class="flex items-center gap-3">
            <Button @click="handleCancel" variant="secondary">
              Cancel
            </Button>
            <Button @click="handleSave" :disabled="isSaving" variant="primary">
              {{ isSaving ? 'Saving...' : saveButtonText }}
            </Button>
          </div>

          <!-- Admin Menu (only show when not on recipe edit page) -->
          <div v-if="!isRecipeEditPage" class="relative" ref="adminMenuRef">
            <button v-if="isLoggedIn" @click="showDropdown = !showDropdown"
              class="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2">
              <span>Admin</span>
              <IconChevronDown class="w-4 h-4 transition-transform duration-200 ease-in-out" :class="{ 'rotate-180': showDropdown }" />
            </button>
            <NuxtLink v-else to="/admin/login" class="text-gray-700 hover:text-gray-900">
              <IconUser class="w-6 h-6" />
            </NuxtLink>

            <!-- Dropdown Menu -->
            <Transition enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95 -translate-y-1" enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0" leave-to-class="opacity-0 scale-95 -translate-y-1">
              <div v-if="showDropdown && isLoggedIn"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <NuxtLink to="/admin/recipes/new" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showDropdown = false">
                  Add Recipe
                </NuxtLink>
                <NuxtLink to="/admin/recipes" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showDropdown = false">
                  Recipe List
                </NuxtLink>
                <button @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </Transition>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">

import IconClose from '~/components/icons/IconClose.vue'
import IconChevronDown from '~/components/icons/IconChevronDown.vue'
import IconUser from '~/components/icons/IconUser.vue'
import Button from '~/components/Button.vue'
import LogoIcon from '~/components/logos/LogoIcon.svg?component'
import LogoType from '~/components/logos/LogoType.svg?component'

const route = useRoute()
const isLoggedIn = ref(false)
const showDropdown = ref(false)
const adminMenuRef = ref<HTMLElement | null>(null)

// Recipe title from page
const recipeTitle = ref<string | null>(null)

// Check if we're on the recipe edit/create page
const isRecipeEditPage = computed(() => {
  const path = route.path
  return path.startsWith('/admin/recipes/') && (path === '/admin/recipes/new' || (route.params.id && route.params.id !== 'new'))
})

const isSaving = ref(false)
const saveButtonText = computed(() => {
  if (route.path.includes('/new')) {
    return 'Save Recipe'
  }
  return 'Update Recipe'
})

// Handle save - trigger form submission via event
function handleSave() {
  window.dispatchEvent(new CustomEvent('recipe-form-submit'))
}

// Handle cancel
function handleCancel() {
  navigateTo('/admin/recipes')
}

// Handle back
function handleBack() {
  if (process.client && window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/admin/recipes')
  }
}

// Listen for saving state updates and recipe title updates
onMounted(() => {
  // Reset saving state when component mounts
  isSaving.value = false

  window.addEventListener('recipe-form-saving', ((e: CustomEvent) => {
    isSaving.value = e.detail.saving
  }) as EventListener)

  window.addEventListener('recipe-title-update', ((e: CustomEvent) => {
    recipeTitle.value = e.detail.title
  }) as EventListener)
})

// Reset saving state when route changes
watch(() => route.path, () => {
  isSaving.value = false
  recipeTitle.value = null
})

// Check login status
async function checkLoginStatus() {
  try {
    const session = await $fetch('/api/admin/session')
    isLoggedIn.value = session.loggedIn
  } catch {
    isLoggedIn.value = false
  }
}

// Handle logout
async function handleLogout() {
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
    isLoggedIn.value = false
    showDropdown.value = false
    await navigateTo('/')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (adminMenuRef.value && !adminMenuRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  checkLoginStatus()
  // Refresh login status periodically
  setInterval(checkLoginStatus, 5000)

  // Listen for clicks outside
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
