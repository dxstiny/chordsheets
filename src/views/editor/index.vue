<script lang="ts" setup>
import type { ISong } from '@/types';
import Song from './Song.vue';

const song: ISong = {
    title: "Livin' On A Prayer",
    artist: 'Bon Jovi',
    bpm: 123,
    key: 'C',
    timeSignature: '4/4',
    sections: [{
        type: "intro",
        progression: [
            { chord: "Em", duration: 16 },
            { chord: "Em", duration: 16 },
            { chord: "Em", duration: 16 },
            { chord: "Em", duration: 16 },
            { chord: "C", duration: 4 },
            { chord: "D", duration: 4 },
            { chord: "Em", duration: 8 },
            { chord: "C", duration: 4 },
            { chord: "D", duration: 4 },
            { chord: "Em", duration: 8 },
        ]
    }, {
        type: "verse",
        progression: [
            { chord: "Em", duration: 16 },
            { chord: "C", duration: 4 },
            { chord: "D", duration: 4 },
            { chord: "Em", duration: 8 },
            { chord: "Em", duration: 16 },
            { chord: "C", duration: 4 },
            { chord: "D", duration: 4 },
            { chord: "Em", duration: 8 },
        ]
    }, {
        type: "chorus",
        progression: [
            { chord: "Em", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "D", duration: 4 },
            { chord: "G", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "D", duration: 4 },
            { chord: "Em", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "D", duration: 4 },
            { chord: "G", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "D", duration: 4 },
            { chord: "Em", duration: 8 },
        ]
    }, {
        type: "solo",
        progression: [
            { chord: "Em", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "D", duration: 4 },
            { chord: "G", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "D", duration: 4 },
            { chord: "Em", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "D", duration: 4 },
            { chord: "G", duration: 1 },
            { chord: "C", duration: 3 },
            { chord: "Em", duration: 4 },
            { chord: "Em", duration: 4 },
        ]
    }]
}
</script>
<template>
<div class="editor">
    <div class="preview">
        <div class="print a4">
            <Song
                :song="song"
            />
        </div>
    </div>
    <div class="config">

    </div>
</div>
</template>

<style scoped>
.editor {
    display: grid;
    grid-template-columns: max-content 1fr;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.preview {
    background: var(--color-background-soft);
    border-radius: 0 2rem 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10em;
}
</style>
