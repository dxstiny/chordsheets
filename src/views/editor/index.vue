<script lang="ts" setup>
import { type ISong } from "@/types";
import Song from "./Song.vue";
import { ref } from "vue";
import { useSongStore } from "@/stores/songs";
import { useRoute, useRouter } from "vue-router";
import Editor from "./Editor.vue";
import MinWidth from "../MinWidth.vue";

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
const preview = ref<InstanceType<typeof Song>>();

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
            to="/browse"
            class="back-button"
        >
            <span class="material-symbols-rounded">arrow_back</span>
        </router-link>
        <div class="editor">
            <div class="preview">
                <div
                    class="pages"
                    v-if="preview"
                >
                    <template v-if="false">
                        <span
                            @click="preview.prevPage"
                            class="material-symbols-rounded"
                        >
                            chevron_left
                        </span>
                        {{ preview.getCurrentPage() }} /
                        {{ preview.getTotalPages() }}
                        <span
                            @click="preview.nextPage"
                            class="material-symbols-rounded"
                        >
                            chevron_right
                        </span>
                    </template>
                    <span
                        class="material-symbols-rounded"
                        @click="preview.print"
                    >
                        print
                    </span>
                    <span
                        class="material-symbols-rounded"
                        @click="preview.download"
                    >
                        picture_as_pdf
                    </span>
                    <span
                        class="material-symbols-rounded"
                        @click="save"
                    >
                        file_download
                    </span>
                </div>
                <div class="">
                    <Song
                        :song="song"
                        ref="preview"
                    />
                </div>
            </div>
            <MinWidth
                :minWidth="1100"
                error=""
            >
                <div class="config container">
                    <Editor :song="song" />
                </div>
            </MinWidth>
        </div>
    </MinWidth>
</template>

<style>
.preview {
    .print {
        display: flex;
    }
}
</style>

<style scoped>
.back-button {
    position: fixed;
    top: 2em;
    left: calc(1em + 220px + 2em);
    z-index: 1;

    @media (max-width: 800px) {
        left: 1em;
    }
}

.editor {
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 0;
    gap: 1em;
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
    height: 100%;
    width: 100%;
}

.config {
    flex: 1;
}

.preview {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1em;

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
