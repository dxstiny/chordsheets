<script lang="ts" setup>
import { type ISong } from "@/types";
import { ref } from "vue";
import { useSongStore } from "@/stores/songs";
import { useRoute, useRouter } from "vue-router";
import MinWidth from "../MinWidth.vue";
import Editor from "./Editor.vue";

const songs = useSongStore();

const route = useRoute();
const router = useRouter();
let textId = route.params.id as string;

if (!textId) {
    const id = songs.addEmptySong();
    router.push({
        path: `/editor/${id}`,
        replace: true
    });
    textId = String(id);
}

const s = songs.song(textId);
if (!s) router.push("/");
const song = ref<ISong>(s as ISong);

const save = () => {
    if (!song.value) return;
    // download 'song' as json
    const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(song.value));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
        "download",
        `${song.value.title}.chordsheets.json`
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};
</script>
<template>
    <MinWidth :minWidth="300">
        <router-link
            to="/"
            class="back-button"
        >
            <span class="material-symbols-rounded">arrow_back</span>
        </router-link>

        <div class="editor_container">
            <Editor :song="song" />
        </div>
    </MinWidth>
</template>

<style></style>

<style scoped>
.back-button {
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 1;
}

.editor_container {
    background: var(--color-background-soft);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    padding: 1em;
    overflow: auto;
    min-height: 100vh;
    min-height: 100svh;
}
</style>
