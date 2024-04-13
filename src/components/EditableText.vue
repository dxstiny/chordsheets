<script setup lang="ts">
import { nextTick, ref, watch, computed, onMounted, watchEffect } from "vue";

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    locked: {
        type: Boolean,
        default: false
    },
    noOutline: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: "Click to edit"
    }
});

const value = ref(props.modelValue);
watch(
    () => props.modelValue,
    (newValue) => (value.value = newValue)
);

const editing = ref(false);
const emit = defineEmits(["update:modelValue", "change"]);
const area = ref(null as HTMLTextAreaElement | null);
const startEditing = () => {
    if (props.locked) return;

    editing.value = true;

    nextTick(() => {
        if (!area.value) return;
        area.value.focus();
    });
};

const showSlot = computed(() => {
    if (props.locked) return true;
    if (editing.value) return false;

    return value.value || value.value == "0";
});

const update = (newValue: string) => {
    value.value = newValue;
    emit("change", newValue);
    emit("update:modelValue", newValue);
};

const autoResize = () => {
    if (!area.value) return;

    area.value.style.height = "auto";
    area.value.style.height = area.value.scrollHeight + "px";
};

onMounted(() => autoResize());

watchEffect(() => {
    if (!editing.value) return;
    autoResize();
});
</script>
<template>
    <div
        class="editable-text"
        :class="{ outlined: !noOutline && editing }"
        @dblclick.stop="startEditing"
    >
        <slot v-if="showSlot" />
        <input
            v-else
            ref="area"
            type="text"
            class="textarea"
            v-model="value"
            @change="update(($event.target as HTMLInputElement).value)"
            @input="autoResize()"
            @click.stop="editing = true"
            @keydown.enter="editing = false"
            @keydown.esc="editing = false"
            @blur="editing = false"
            :placeholder="placeholder"
        />
    </div>
</template>
<style scoped>
.editable-text {
    width: 100%;
    text-align: center;
    margin: 0 0.5em;

    &.left {
        text-align: left;
        margin: 0;
    }

    &.short .textarea {
        width: 10ch;
    }

    &.outlined {
        border: 1px solid var(--color-border);
        border-radius: 0.5em;
    }
}

.h1 textarea,
.h1 .textarea {
    font-size: inherit;
    margin-block-start: 0;
    margin-block-end: 0;
    font-family: Outfit, sans-serif;
    font-size: 24px;
}

textarea,
.textarea {
    width: 100%;
    border: none;
    background: none;
    font-size: inherit;
    font-weight: 900;
    font-family: inherit;
    color: inherit;
    outline: none;
    color: var(--fg-base);
    resize: none;
    padding: 0;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box; /* Opera/IE 8+ */

    &:placeholder {
        color: var(--fg-base-dk);
        font-weight: 400;
        font-style: italic;
    }
}
</style>
