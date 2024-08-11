<script setup lang="ts">
import { nextTick, ref, watch, computed, onMounted, watchEffect } from "vue";
import EditableText from "@/components/EditableText.vue";

const props = defineProps({
    modelValue: {
        type: Number,
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

const value = ref(String(props.modelValue));
watch(
    () => props.modelValue,
    (newValue) => (value.value = String(newValue))
);

const emit = defineEmits(["update:modelValue", "change"]);

const update = (newValue: string) => {
    const numericValue = Number(newValue);
    value.value = newValue;
    emit("change", numericValue);
    emit("update:modelValue", numericValue);
};
</script>
<template>
    <EditableText v-model="value" @change="update" :no-outline="noOutline" :locked="locked" :placeholder="placeholder">
        <slot />
    </EditableText>
</template>
