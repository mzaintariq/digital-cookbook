<template>
  <div class="h-screen bg-paper-50 flex flex-col overflow-hidden">
    <AppHeader />
    <main class="flex-1 min-h-0">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
