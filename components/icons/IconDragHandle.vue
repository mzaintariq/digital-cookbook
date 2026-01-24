<template>
    <svg :class="iconClass" :width="size" :height="size" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="5" r="1.5" />
        <circle cx="16" cy="5" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="16" cy="12" r="1.5" />
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="16" cy="19" r="1.5" />
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
