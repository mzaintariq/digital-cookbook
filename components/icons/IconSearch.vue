<template>
    <svg :class="iconClass" :width="size" :height="size" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
</template>

<script setup>
defineProps({
    size: {
        type: [Number, String],
        default: 20,
    },
    iconClass: {
        type: String,
        default: '',
    },
})
</script>
