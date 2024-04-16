<template>
    <div
        class="switch"
        @click="emitInput(!modelValue)"
    >
        <h2 v-if="label">{{ label }}</h2>
        <span
            class="slider"
            :class="{ checked: modelValue }"
        >
        </span>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    modelValue: {
        required: true,
        type: Boolean
    },
    label: {
        required: false,
        type: String
    }
});
const emit = defineEmits(["update:modelValue"]);

const emitInput = (value: boolean) => {
    emit("update:modelValue", value);
};
</script>

<style scoped>
h2 {
    margin: 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.switch {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
}

.slider {
    display: block;
    border: 1px solid var(--color-background-soft);
    background: var(--color-border);
    border-radius: 1000vmax;
    position: relative;
    padding: 0.5em;
    width: 52px;
    height: 28px;
    transition: background 0.2s;

    &:after {
        content: "";
        display: block;
        background: var(--color-background-soft);
        border-radius: 100%;
        width: 22px;
        height: 22px;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: left 0.2s;
    }

    &.checked {
        background: var(--accent);

        &::after {
            left: calc(100% - 22px - 2px);
        }
    }

    &:focus {
        outline: none;
        border-color: var(--accent);
    }
}
</style>
