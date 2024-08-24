<script setup lang="ts">
import { useSongStore } from "@/stores/songs";
import Editor from "../editor2/Editor.vue";
import Song from "@/components/Song.vue";
import { ref } from "vue";
import type { ISetlist, ISong } from "@/types";
import EditableText from "@/components/EditableText.vue";

const store = useSongStore();

const pageCounts = ref<number[]>(store.songs.map(() => 1));

const setlist = ref<ISetlist>({
    id: new Date().getTime(),
    name: "Setlist 1",
    sections: [
        {
            id: new Date().getTime(),
            name: "The Awakening",
            songs: store.songs.slice(0, 5).map((song) => ({ id: song.id }))
        },
        {
            id: new Date().getTime(),
            name: "The Journey",
            songs: store.songs.slice(5, 10).map((song) => ({ id: song.id }))
        },
        {
            id: new Date().getTime(),
            name: "The Aftermath",
            songs: store.songs.slice(10, 15).map((song) => ({ id: song.id }))
        }
    ]
});

const getSong = (song: { id: number } | ISong) => {
    if ("title" in song) {
        return song;
    }
    return store.songs.find((s) => s.id === song.id) as ISong;
};
</script>

<template>
    <div class="browser">
        <div class="editor">
            <div
                class="container"
                v-for="section in setlist.sections"
            >
                <EditableText
                    v-model="section.name"
                    placeholder="Section name"
                >
                    <h2>{{ section.name }}</h2>
                </EditableText>
                <Song
                    v-for="song in section.songs"
                    :key="song.id"
                    :song="getSong(song)"
                />
            </div>
        </div>
        <div class="preview">
            <template v-for="(section, sectionIndex) in setlist.sections">
                <hr v-if="sectionIndex > 0" />
                <h2>{{ section.name }}</h2>
                <Editor
                    ref="allPages"
                    v-for="(song, i) in section.songs"
                    printing
                    :song="getSong(song)"
                    @on-page-count="pageCounts[i] = $event"
                    :page-offset="
                        pageCounts.slice(0, i).reduce((a, b) => a + b, 0)
                    "
                    :section-name="section.name"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
.browser {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
    height: 100%;
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
}

.editor {
    flex: 3;
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.preview {
    flex: 2;
    overflow: auto;
    height: 100%;
    max-width: max-content;
    padding: 1em;
}
</style>
