<script setup lang="ts">
defineProps({
    icon: {
        required: true,
        type: String
    },
    label: {
        required: true,
        type: String
    }
});
</script>
<template>
    <button class="icon-button">
        <i class="material-symbols-rounded">{{ icon }}</i>
        <span>{{ label }}</span>
    </button>
</template>

<style scoped>
.icon-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;
    padding: 0.5em 1em;

    background: var(--color-heading);
    border: 1px solid var(--color-border);
    border-radius: 100vmax;
    color: var(--color-background-soft);
    cursor: pointer;
    text-transform: capitalize;
    font-family: inherit;

    &:hover {
        background: var(--accent);
        color: var(--color-heading);
    }
}
</style>
