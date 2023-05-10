<script lang="ts" setup>
import type { ISong } from '@/types';
import type { PropType } from 'vue';

defineProps({
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
})
</script>
<template>
    <div class="song">
        <h2>{{ song.artist }}</h2>
        <h1>{{ song.title }}</h1>
        <div class="wrap-to-line">
            <div class="info">
                <span class="material-symbols-rounded">music_note</span> {{ song.bpm }} BPM
            </div>
            <div class="info">
                <span class="material-symbols-rounded">piano</span> {{ song.key }}
            </div>
            <div class="info">
                <span class="material-symbols-rounded">schedule</span> {{ song.timeSignature }}
            </div>
        </div>
        <hr />
        <div
            class="section"
            v-for="section in song.sections"
        >
            <span>{{ section.type }}</span>
            <div class="progression">
                <div
                    class="chord"
                    v-for="chord in section.progression"
                    :class="`w-${chord.duration}`"
                >
                    {{ chord.chord }}
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.song h1 {
    font-size: 1.5rem;
}

.song h2 {
    font-size: .8rem;
    text-transform: uppercase;
}

.material-symbols-rounded {
    font-size: 1em;
}

.wrap-to-line {
    display: flex;
    flex-direction: row;
    align-items: center;

    .info:not(:last-child) {
        margin-right: 1em;
        padding-right: 1em;
        
        &:after {
            content: ' ';
            width: 1px;
            height: 100%;
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            background: var(--color-border);
        }
    }
}

hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 1em 0;
}

.section {
    &:not(:last-child) {
        margin-bottom: 1em;
    }

    & span {
        text-transform: uppercase;
        font-size: .8rem;
        font-weight: bold;
    }
}

.progression {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    grid-gap: 1em;
    align-items: center;
    grid-template-rows: auto;
}

.progression > div {
    display: flex;
    justify-content: center;
    border: 1px solid var(--color-border);
}

.progression .w-1 {
    grid-column: span 1;
}
.progression .w-2 {
    grid-column: span 2;
}
.progression .w-3 {
    grid-column: span 3;
}
.progression .w-4 {
    grid-column: span 4;
}
.progression .w-5 {
    grid-column: span 5;
}
.progression .w-8 {
    grid-column: span 8;
}
.progression .w-16 {
    grid-column: span 16;
}
</style>
