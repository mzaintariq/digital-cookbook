<template>
    <svg :class="iconClass" :width="size" :height="size" fill="none" stroke="currentColor" viewBox="0 0 10 2"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M1 1h8" />
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
