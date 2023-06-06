<template>
    <div
        class="input"
        @click="emitInput(!modelValue)"
    >
        <span class="material-symbols-rounded">
            {{ modelValue ? "check_box" : "check_box_outline_blank" }}
        </span>
        <h2 v-if="label">{{ label }}</h2>
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
.input {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    cursor: pointer;
}

h2 {
    margin: 0;
    margin-bottom: 0.5em;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

input {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    padding: 0.5em;
    color: var(--color-text);
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

    &:focus {
        outline: none;
        border-color: #d2d2d2;
    }
}
</style>
