<template>
    <div class="input">
        <h2 v-if="label">{{ label }}</h2>
        <input
            :value="modelValue"
            @input="emitInput"
            class="textinput"
            type="number"
            :max="max"
            :min="min"
        />
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps({
    modelValue: {
        required: true,
        type: Number
    },
    max: {
        required: false,
        type: Number
    },
    min: {
        required: false,
        type: Number
    },
    label: {
        required: false,
        type: String
    }
});
const emit = defineEmits(["update:modelValue"]);

const emitInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    emit("update:modelValue", value);
};
</script>

<style scoped>
.input {
    display: flex;
    flex-direction: column;
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
    color: #d2d2d2;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

    &:focus {
        outline: none;
        border-color: #d2d2d2;
    }
}
</style>
