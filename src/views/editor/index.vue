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
        <div
            class="editor"
            v-if="song"
        >
            <router-link
                to="/"
                class="back-button"
            >
                <span class="material-symbols-rounded">arrow_back</span>
            </router-link>

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
                <div class="config">
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
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 1;
}

.editor {
    display: grid;
    grid-template-columns: max-content 1fr;
    height: 100vh;
    height: 100svh;
    width: 100vw;
    overflow: hidden;
    position: relative;
    z-index: 0;

    @media screen and (max-width: 1100px) {
        grid-template-columns: 1fr;
    }
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

    @media screen and (max-width: 1100px) {
        border-radius: 0;
        height: 100vh;
        height: 100svh;
        width: 100vw;
        padding: 1em;
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
