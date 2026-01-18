<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo or Recipe Title -->
        <NuxtLink v-if="!isRecipeEditPage" to="/" class="flex items-center">
          <div class="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
            <span class="text-gray-600 font-bold text-lg">RV</span>
          </div>
        </NuxtLink>
        <div v-else class="flex items-center gap-3">
          <button
            @click="handleBack"
            class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <span class="text-gray-900 font-semibold text-lg">
            {{ recipeTitle || (saveButtonText === 'Save Recipe' ? 'New Recipe' : 'Edit Recipe') }}
          </span>
        </div>
        
        <!-- Navigation -->
        <nav class="flex items-center gap-6">
          <NuxtLink
            v-if="!isRecipeEditPage"
            to="/recipes"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            Recipes
          </NuxtLink>
          
          <!-- Recipe Edit Page Actions -->
          <div v-if="isRecipeEditPage" class="flex items-center gap-3">
            <button
              @click="handleCancel"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              {{ isSaving ? 'Saving...' : saveButtonText }}
            </button>
          </div>
          
          <!-- Admin Menu (only show when not on recipe edit page) -->
          <div v-if="!isRecipeEditPage" class="relative" ref="adminMenuRef">
            <button
              v-if="isLoggedIn"
              @click="showDropdown = !showDropdown"
              class="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              <span>Admin</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <NuxtLink
              v-else
              to="/admin/login"
              class="text-gray-700 hover:text-gray-900"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </NuxtLink>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showDropdown && isLoggedIn"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
            >
              <NuxtLink
                to="/admin/recipes/new"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showDropdown = false"
              >
                + New Recipe
              </NuxtLink>
              <NuxtLink
                to="/admin/recipes"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showDropdown = false"
              >
                Recipe List
              </NuxtLink>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
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

