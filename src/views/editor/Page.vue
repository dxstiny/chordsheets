<script setup lang="ts">
import type { ISong, ISection } from '@/types';
import { type PropType, ref } from 'vue';

defineProps({
    currentPage: {
        required: true,
        type: Number
    },
    pages: {
        required: true,
        type: Array as PropType<ISection[][]>
    },
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
});

const sections = ref<HTMLDivElement[]>([]);

const getSections = () => {
    return sections;
};

defineExpose({
    getSections
});
</script>

<template>
    <div
        class="meta"
        v-if="currentPage == 0"
    >
        <h2>{{ song.artist }}</h2>
        <h1>{{ song.title }}</h1>
        <div class="wrap-to-line">
            <div class="info">
                <span class="material-symbols-rounded">music_note</span>
                {{ song.bpm }} BPM
            </div>
            <div class="info">
                <span class="material-symbols-rounded">piano</span>
                {{ song.key }}
            </div>
            <template v-for="(active, name) in song.options">
                <div
                    class="info"
                    v-if="active"
                >
                    <span class="material-symbols-rounded"> check </span>
                    <span class="capitalise">{{ name }}</span>
                </div>
            </template>
        </div>
        <hr />
        <div class="instruments">
            <div
                v-for="(instrument, name) in song.instruments"
                class="instrument"
            >
                <div class="flex space-between">
                    <span>{{ name }}</span>
                    <span class="flex gap-2">
                        <span class="material-symbols-rounded">volume_up</span>
                        {{ instrument?.volume }}
                    </span>
                </div>
                <div class="settings">
                    <h3>
                        {{ instrument?.name }}
                    </h3>
                    <span class="muted">
                        {{ instrument?.type }}
                        <template v-if="instrument?.page">
                            | P{{ instrument?.page }}
                        </template>
                    </span>
                </div>
            </div>
        </div>
        <hr />
    </div>
    <div
        class="section"
        v-for="section in pages[currentPage]"
        ref="sections"
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
</template>
