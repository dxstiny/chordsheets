<script lang="ts" setup>
import type { ISong } from '@/types';
import Song from './Song.vue';
import { ref } from 'vue';

const song: ISong = {
    title: "Livin' On A Prayer",
    artist: 'Bon Jovi',
    bpm: 123,
    key: 'C',
    timeSignature: '4/4',
    sections: [
        {
            type: 'intro',
            progression: [
                { chord: 'Em', duration: 16 },
                { chord: 'Em', duration: 16 },
                { chord: 'Em', duration: 16 },
                { chord: 'Em', duration: 16 },
                { chord: 'C', duration: 4 },
                { chord: 'D', duration: 4 },
                { chord: 'Em', duration: 8 },
                { chord: 'C', duration: 4 },
                { chord: 'D', duration: 4 },
                { chord: 'Em', duration: 8 }
            ]
        },
        {
            type: 'verse',
            progression: [
                { chord: 'Em', duration: 16 },
                { chord: 'C', duration: 4 },
                { chord: 'D', duration: 4 },
                { chord: 'Em', duration: 8 },
                { chord: 'Em', duration: 16 },
                { chord: 'C', duration: 4 },
                { chord: 'D', duration: 4 },
                { chord: 'Em', duration: 8 }
            ]
        },
        {
            type: 'chorus',
            progression: [
                { chord: 'Em', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'D', duration: 4 },
                { chord: 'G', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'D', duration: 4 },
                { chord: 'Em', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'D', duration: 4 },
                { chord: 'G', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'D', duration: 4 },
                { chord: 'Em', duration: 8 }
            ]
        },
        {
            type: 'solo',
            progression: [
                { chord: 'Em', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'D', duration: 4 },
                { chord: 'G', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'D', duration: 4 },
                { chord: 'Em', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'D', duration: 4 },
                { chord: 'G', duration: 1 },
                { chord: 'C', duration: 3 },
                { chord: 'Em', duration: 4 },
                { chord: 'Em', duration: 4 }
            ]
        }
    ],
    transpose: 0,
    octave: 0,
    options: {
        touch: true,
        sustain: false,
        mono: false
    },
    instruments: {
        l: {
            type: 'Synth',
            name: 'PunchyChordz',
            volume: 127,
            page: 1
        },
        r1: {
            type: 'Synth',
            name: 'WildPWM',
            volume: 100,
            page: 2
        },
        r2: {
            type: 'Synth',
            name: 'DetunedVintage',
            volume: 100,
            page: 2
        }
    }
};

const preview = ref<InstanceType<typeof Song>>();
</script>
<template>
    <div class="editor">
        <div class="preview">
            <div
                class="pages"
                v-if="preview"
            >
                <span
                    @click="preview.prevPage"
                    class="material-symbols-rounded"
                >
                    chevron_left
                </span>
                {{ preview.getCurrentPage() }} / {{ preview.getTotalPages() }}
                <span
                    @click="preview.nextPage"
                    class="material-symbols-rounded"
                >
                    chevron_right
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="preview.print"
                >
                    print
                </span>
            </div>
            <div class="print a4">
                <Song
                    :song="song"
                    ref="preview"
                />
            </div>
        </div>
        <div class="config"></div>
    </div>
</template>

<style scoped>
.editor {
    display: grid;
    grid-template-columns: max-content 1fr;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    z-index: 0;
}

.preview {
    background: var(--color-background-soft);
    border-radius: 0 2rem 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1em;
    padding: 0 10em;

    .print {
        display: flex;
    }

    .pages {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        color: var(--color-text);

        .material-symbols-rounded {
            cursor: pointer;
        }
    }
}
</style>
