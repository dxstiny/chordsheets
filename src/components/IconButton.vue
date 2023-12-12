<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
    icon: {
        required: false,
        type: String
    },
    label: {
        required: false,
        type: String
    },
    style: {
        required: false,
        type: String as PropType<"green" | "red" | "blue" | "yellow">
    },
    disabled: {
        required: false,
        type: Boolean,
        default: false
    }
});
</script>
<template>
    <button
        class="icon-button"
        :style="style ? `--accent: var(--color-${style})` : ''"
        :disabled="disabled"
        :class="{ disabled }"
    >
        <i
            v-if="icon"
            class="material-symbols-rounded"
            >{{ icon }}</i
        >
        <span v-if="label">{{ label }}</span>
    </button>
</template>

<style scoped>
.icon-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1em;
    padding: 0.5em 1em;

    background: var(--color-heading);
    border: 1px solid var(--color-border);
    border-radius: 100vmax;
    color: var(--color-background-soft);
    cursor: pointer;
    text-transform: capitalize;
    font-family: inherit;
    background: var(--accent);

    &:hover {
        background: var(--accent);
        color: var(--color-heading);
    }

    &.disabled {
        background: var(--color-border);
        color: var(--color-text-mute);
        cursor: not-allowed;
    }
}
</style>
