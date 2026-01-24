<template>
    <svg :class="iconClass" :width="size" :height="size" fill="currentColor" viewBox="0 0 20 20"
        aria-hidden="true">
        <path fill-opacity=".5" d="M2 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5Z" />
        <path fill-opacity=".5" fill-rule="evenodd"
            d="M15 4a1 1 0 0 0-1 1v5.5c.456-.607 1.182-1 2-1 .818 0 1.544.393 2 1V5a1 1 0 0 0-1-1h-2ZM9 4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1.708A2.5 2.5 0 0 1 12 12.708V5a1 1 0 0 0-1-1H9Z"
            clip-rule="evenodd" />
        <path fill-rule="evenodd"
            d="M16 11a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1Z"
            clip-rule="evenodd" />
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
