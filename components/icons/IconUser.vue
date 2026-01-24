<template>
    <svg :class="iconClass" :width="size" :height="size" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
