<script lang="ts" setup>
import { ref, computed, type PropType } from "vue";
import { SHARP_KEYS, type Key } from "../../types";

const props = defineProps({
    min: {
        type: Number,
        default: 60
    },
    max: {
        type: Number,
        default: 72
    },
    highlight: {
        type: Array as PropType<Number[]>,
        default: []
    },
    clickable: {
        type: Boolean,
        default: false
    }
});

const keys = computed(() => {
    const keys = [];
    for (let i = props.min; i <= props.max; i++) {
        keys.push({
            name: SHARP_KEYS[i % 12],
            i
        });
    }
    return keys;
});
const isBlackKey = (key: Key) => {
    return key.includes("#") || key.includes("b");
};
const blackKeyPosition = ({ name, i }: { name: Key; i: number }) => {
    if (!isBlackKey(name)) return;

    // index of white key to the left, * 50px - 15px
    const whiteKeys = keys.value.filter((key) => !isBlackKey(key.name));

    const whiteKeyLeft = whiteKeys.findIndex((key) => key.i === i - 1) + 1;
    return whiteKeyLeft * 50 - 15 + "px";
};
const doHighlight = (key: number) => {
    return props.highlight.includes(key);
};

defineEmits(["keypress"]);
</script>
<template>
    <div class="keyboard">
        <div
            v-for="key in keys"
            :class="{
                black: isBlackKey(key.name),
                highlight: doHighlight(key.i),
                clickable
            }"
            :style="{
                left: blackKeyPosition(key)
            }"
            class="key"
            @click="$emit('keypress', key.i)"
        >
            {{ key.name }}
        </div>
    </div>
</template>
<style scoped>
.keyboard {
    display: flex;
    height: 100px;
    width: max-content;
    border-radius: 1em;
    overflow: hidden;
    border: 2px solid var(--color-border);
}

.key {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 50px;
    background: #fff;
    color: #000;

    &:not(:last-child) {
        border-right: 1px solid var(--color-border);
    }

    &.black {
        background: #000;
        color: #fff;
        position: absolute;
        height: 70%;
        width: 30px;
        z-index: 1;
    }

    &.highlight {
        background: var(--accent);
        color: #fff;

        &.black {
            background: color-mix(in srgb, var(--accent) 60%, #000);
        }
    }

    &.clickable:hover::after {
        content: "";
        position: absolute;
        inset: 0;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.2);
    }
}
</style>
