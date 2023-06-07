<script lang="ts" setup>
import { type IMidiTrack, type INote } from "@/importMidi";
import { computed, type PropType } from "vue";

const props = defineProps({
    track: {
        type: Object as PropType<IMidiTrack>,
        required: true
    },
    width: {
        type: Number,
        default: 1000
    },
    height: {
        type: Number,
        default: 300
    }
});

const TARGET_SIZE = computed(() => ({
    width: props.width,
    height: props.height
}));

const notes = computed(() => {
    return props.track.notes;
});

const boundaries = computed(() => {
    if (!notes.value) return null;

    let yMin = Math.min(...notes.value.map((n) => n.note));
    let yMax = Math.max(...notes.value.map((n) => n.note));
    const xMin = Math.min(...notes.value.map((n) => n.start));
    const xMax = Math.max(...notes.value.map((n) => n.start + n.duration));

    // round yMin & yMax to nearest C
    yMin = Math.floor(yMin / 12) * 12;
    yMax = Math.ceil(yMax / 12) * 12;

    return {
        y: { min: yMin, max: yMax },
        x: { min: xMin, max: xMax }
    };
});

const stretch = computed(() => {
    if (!boundaries.value) return null;
    const { x, y } = boundaries.value;

    const xScale = TARGET_SIZE.value.width / x.max;
    const yScale = TARGET_SIZE.value.height / (y.max - y.min + 1);

    return {
        x: xScale,
        y: yScale
    };
});

const getContainerStyle = () => {
    if (!stretch.value) return null;
    if (!boundaries.value) return null;
    const { x, y } = boundaries.value;
    if (!x || !y) return null;

    return {
        height: `${stretch.value.y * (1 + y.max - y.min)}px`,
        width: `${stretch.value.x * x.max}px`
    };
};

const getNoteStyle = (note: INote) => {
    if (!stretch.value) return null;
    if (!boundaries.value) return null;
    const { x, y } = boundaries.value;
    if (!x || !y) return null;

    const top = note.note - y.min;
    const left = note.start;

    return {
        backgroundColor: "var(--accent)",
        position: "absolute",
        height: `${stretch.value.y}px`,
        width: `${note.duration * stretch.value.x}px`,
        bottom: `${top * stretch.value.y}px`,
        left: `${left * stretch.value.x}px`
    };
};

const getBackStyle = () => {
    if (!stretch.value) return null;
    if (!boundaries.value) return null;
    const { x, y } = boundaries.value;
    if (!x || !y) return null;

    const styles = [];
    for (let i = y.min; i <= y.max; i++) {
        const isBlackKey = [1, 3, 6, 8, 10].includes(i % 12);
        const backgroundColor = isBlackKey
            ? "var(--color-background)"
            : "var(--color-background-soft)";

        const ticksPerMetronome = props.track.signature.clocksPerTick;
        const ticksPerBeat =
            ticksPerMetronome * props.track.signature.numerator;
        const denominator = 2 ** props.track.signature.denominator;

        let linearBackground = "repeating-linear-gradient(to right,";
        for (let j = 0; j < denominator; j++) {
            const lineColour =
                j % denominator === denominator - 1
                    ? "black"
                    : "var(--color-background-soft)";

            const start = j * ticksPerBeat * stretch.value.x;
            const end = (j + 1) * ticksPerBeat * stretch.value.x;

            linearBackground += `${backgroundColor} ${start + 1}px,`;
            linearBackground += `${backgroundColor} ${end}px,`;
            linearBackground += `${lineColour} ${end}px,`;
            linearBackground += `${lineColour} ${end + 1}px,`;
        }
        linearBackground = linearBackground.slice(0, -1) + ")";

        styles.push({
            background: linearBackground,
            position: "absolute",
            height: `${stretch.value.y}px`,
            width: TARGET_SIZE.value.width + "px",
            bottom: `${(i - y.min) * stretch.value.y}px`,
            left: `${0}px`
        });
    }

    return styles;
};

const getKeyStyle = () => {
    if (!stretch.value) return null;
    if (!boundaries.value) return null;
    const { x, y } = boundaries.value;
    if (!x || !y) return null;

    const styles = [];
    for (let i = y.min; i <= y.max; i++) {
        const isBlackKey = [1, 3, 6, 8, 10].includes(i % 12);
        const isC = i % 12 === 0;
        const background = isBlackKey ? "black" : isC ? "lightgrey" : "white";

        const blackKeyPercentage = isBlackKey ? 0.7 : 1;

        styles.push({
            backgroundColor: background,
            position: "absolute",
            height: `${stretch.value.y}px`,
            width: `${100 * blackKeyPercentage * stretch.value.x}px`,
            bottom: `${(i - y.min) * stretch.value.y}px`,
            left: `${0}px`
        });

        if (isBlackKey) {
            styles.push({
                backgroundColor: "white",
                position: "absolute",
                height: `${stretch.value.y}px`,
                width: `${
                    (100 - 100 * blackKeyPercentage) * stretch.value.x
                }px`,
                bottom: `${(i - y.min) * stretch.value.y}px`,
                left: `${blackKeyPercentage * 100 * stretch.value.x}px`
            });
        }
    }

    return styles;
};

const getKeyboardStyle = () => {
    if (!stretch.value) return null;
    if (!boundaries.value) return null;
    const { x, y } = boundaries.value;
    if (!x || !y) return null;

    return {
        height: `${(1 + y.max - y.min) * stretch.value.y}px`,
        width: `${100 * stretch.value.x}px`
    };
};
</script>
<template>
    <div
        class="keyboard"
        v-if="track"
    >
        <div
            class="keys"
            :style="getKeyboardStyle()"
        >
            <div
                v-for="key in getKeyStyle()"
                :style="key"
            />
        </div>
        <div
            class="notes"
            :style="getContainerStyle()"
        >
            <div
                v-for="thisStyle in getBackStyle()"
                :style="thisStyle"
            />
            <div
                class="note"
                v-for="note in notes"
                :style="getNoteStyle(note)"
            />
        </div>
    </div>
</template>

<style scoped>
.keyboard {
    display: flex;
    flex-direction: row;
    border-radius: 1em;
    border: 1px solid var(--color-border);
    overflow: hidden;
    width: min-content;
}

.notes {
    position: relative;
    overflow: hidden;
}
</style>
