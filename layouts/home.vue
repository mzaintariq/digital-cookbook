<template>
  <div class="h-screen bg-paper-50 dark:bg-paper-950 text-ink-900 dark:text-paper-100 flex flex-col overflow-hidden">
    <AppHeader />
    <main class="flex-1 min-h-0">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
