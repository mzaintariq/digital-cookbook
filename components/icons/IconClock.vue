<template>
    <svg :class="iconClass" :width="size" :height="size" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
