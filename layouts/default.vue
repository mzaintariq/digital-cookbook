<template>
  <div class="min-h-screen bg-paper-50 dark:bg-paper-950 text-ink-900 dark:text-paper-100 flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
