<template>
    <div class="input">
        <h2 v-if="label">{{ label }}</h2>
        <div class="items">
            <input
                :value="modelValue"
                @input="emitInput"
                class="textinput"
                type="text"
                :placeholder="placeholder"
                @change="$emit('change')"
            />
            <IconButton
                v-if="buttonLabel || buttonIcon"
                :label="buttonLabel"
                :icon="buttonIcon"
                @click="$emit('buttonClick')"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import IconButton from "./IconButton.vue";

defineProps({
    modelValue: {
        required: true,
        type: String
    },
    label: {
        required: false,
        type: String
    },
    placeholder: {
        required: false,
        type: String
    },
    buttonLabel: {
        required: false,
        type: String
    },
    buttonIcon: {
        required: false,
        type: String
    }
});
const emit = defineEmits(["update:modelValue", "change", "buttonClick"]);

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
    color: var(--color-text);
    font-family: inherit;

    &:focus {
        outline: none;
        border-color: #d2d2d2;
    }
}

.items {
    display: grid;
    gap: 0.5em;
    grid-template-columns: 1fr;

    &:has(button) {
        grid-template-columns: 1fr 50px;
    }
}
</style>
