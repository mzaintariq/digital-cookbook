<template>
  <div />
</template>

<script setup lang="ts">
const route = useRoute()

await navigateTo(
  {
    path: '/',
    query: route.query,
    hash: route.hash,
  },
  {
    redirectCode: 308,
    replace: true,
  }
)
</script>
