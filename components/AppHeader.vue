<template>
  <header class="pwa-safe-header bg-paper-50 dark:bg-paper-950 border-b border-paper-300 dark:border-paper-800 h-16 min-h-16 shrink-0">
    <div class="container mx-auto px-4 h-full">
      <div class="flex items-center justify-between h-full">
        <!-- Logo or Recipe Title -->
        <NuxtLink v-if="!isRecipeEditPage" to="/"
          class="group flex items-center gap-1 text-brand-primary transition-colors duration-200 hover:text-brand-primary-600"
          aria-label="Digital Cookbook home">
          <LogoIcon class="h-10 w-10 shrink-0" aria-hidden />
          <LogoType class="h-8 w-auto max-w-[140px] shrink-0" aria-hidden />
        </NuxtLink>
        <div v-else class="flex items-center gap-3 min-w-0 flex-1">
          <button @click="handleBack"
            class="w-8 h-8 min-w-8 min-h-8 shrink-0 rounded-full bg-paper-200 dark:bg-paper-800 hover:bg-paper-300 dark:hover:bg-paper-700 flex items-center justify-center transition-colors">
            <IconClose class="w-5 h-5 text-ink-800 dark:text-paper-100 shrink-0" />
          </button>
          <span class="text-ink-900 dark:text-paper-50 font-semibold text-lg truncate min-w-0">
            {{ saveButtonText === 'Save Recipe' ? 'New Recipe' : (recipeTitle || 'Edit Recipe') }}
          </span>
        </div>

        <!-- Desktop Navigation (hidden on mobile when not edit page) -->
        <nav v-if="!isRecipeEditPage" class="hidden md:flex items-center gap-4 shrink-0">
          <!-- <NuxtLink to="/" class="text-ink-800 dark:text-paper-100 hover:text-ink-900 dark:hover:text-paper-50 font-medium">
            Recipes
          </NuxtLink> -->
          <ThemeToggle />
          <div class="relative" ref="adminMenuRef">
            <button v-if="isLoggedIn" @click="showDropdown = !showDropdown"
              class="text-ink-800 dark:text-paper-100 hover:text-ink-900 dark:hover:text-paper-50 font-medium flex items-center gap-2">
              <span>Admin</span>
              <IconChevronDown class="w-4 h-4 transition-transform duration-200 ease-in-out"
                :class="{ 'rotate-180': showDropdown }" />
            </button>
            <NuxtLink v-else to="/admin/login" class="text-ink-800 dark:text-paper-100 hover:text-ink-900 dark:hover:text-paper-50">
              <IconUser class="w-6 h-6" />
            </NuxtLink>
            <Transition enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95 -translate-y-1" enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0" leave-to-class="opacity-0 scale-95 -translate-y-1">
              <div v-if="showDropdown && isLoggedIn"
                class="absolute right-0 mt-2 w-48 bg-paper-50 dark:bg-paper-900 rounded-md shadow-lg border border-paper-300 dark:border-paper-800 py-1 z-50">
                <NuxtLink to="/admin/recipes/new" class="block px-4 py-2 text-sm text-ink-800 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800"
                  @click="showDropdown = false">
                  Add Recipe
                </NuxtLink>
                <NuxtLink to="/admin/recipes" class="block px-4 py-2 text-sm text-ink-800 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800"
                  @click="showDropdown = false">
                  Recipe List
                </NuxtLink>
                <button @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-ink-800 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800">
                  Logout
                </button>
              </div>
            </Transition>
          </div>
        </nav>

        <!-- Recipe Edit Page Actions (always visible when on edit page) -->
        <nav v-if="isRecipeEditPage" class="flex items-center gap-3 shrink-0">
          <Button @click="handleCancel" variant="secondary" class="hidden md:inline-flex">
            Cancel
          </Button>
          <Button @click="handleSave" :disabled="isSaving" variant="primary" class="whitespace-nowrap">
            <template v-if="isSaving">Saving...</template>
            <template v-else-if="saveButtonText === 'Update Recipe'">
              <span class="md:hidden">Update</span>
              <span class="hidden md:inline">Update Recipe</span>
            </template>
            <template v-else>{{ saveButtonText }}</template>
          </Button>
        </nav>

        <!-- Mobile hamburger (only when not on recipe edit page) -->
        <button v-if="!isRecipeEditPage" @click="showMobileMenu = true"
          class="md:hidden w-10 h-10 flex items-center justify-center text-ink-800 dark:text-paper-100 hover:text-ink-900 dark:hover:text-paper-50 hover:bg-paper-100 dark:hover:bg-paper-800 rounded-full transition-colors"
          aria-label="Open menu">
          <IconMenu class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile menu overlay and panel -->
    <MobileMenu v-model="showMobileMenu" :is-logged-in="isLoggedIn" @logout="closeMobileMenuAndLogout" />
  </header>
</template>

<script setup lang="ts">

import IconClose from '~/components/icons/IconClose.vue'
import IconChevronDown from '~/components/icons/IconChevronDown.vue'
import IconMenu from '~/components/icons/IconMenu.vue'
import IconUser from '~/components/icons/IconUser.vue'
import Button from '~/components/Button.vue'
import LogoIcon from '~/components/logos/LogoIcon.svg?component'
import LogoType from '~/components/logos/LogoType.svg?component'

const route = useRoute()
const isLoggedIn = ref(false)
const showDropdown = ref(false)
const showMobileMenu = ref(false)
const adminMenuRef = ref<HTMLElement | null>(null)
let loginCheckIntervalId: ReturnType<typeof setInterval>

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

// Reset saving state and close mobile menu when route changes
watch(() => route.path, () => {
  isSaving.value = false
  recipeTitle.value = null
  showMobileMenu.value = false
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

// Close mobile menu and logout (for mobile menu logout button)
async function closeMobileMenuAndLogout() {
  showMobileMenu.value = false
  await handleLogout()
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
  loginCheckIntervalId = setInterval(checkLoginStatus, 5000)

  // Listen for clicks outside
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  clearInterval(loginCheckIntervalId)
  document.removeEventListener('click', handleClickOutside)
})
</script>
