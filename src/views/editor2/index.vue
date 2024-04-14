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
const editor = ref<typeof Editor>();

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

const print = async () => {
    await songs.prepareRender();
    const pdf = await editor.value!.render!();
    if (!pdf) return;
    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");
};

const download = async () => {
    await songs.prepareRender();
    const pdf = await editor.value!.render!();
    if (!pdf) return;
    pdf.save(`${song.value.title}.pdf`);
};

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
            <div class="toolbar">
                <span
                    class="material-symbols-rounded"
                    @click="print"
                >
                    print
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="download"
                >
                    picture_as_pdf
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="save"
                >
                    save
                </span>
            </div>

            <Editor
                ref="editor"
                :song="song"
            />
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

.toolbar {
    display: flex;
    gap: 1em;
    justify-content: center;
    align-items: center;
    padding: 1em;
    background: var(--color-background);
    border-radius: 0.5em;
    border: 1px solid var(--color-border);
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1;

    & span {
        cursor: pointer;

        &:hover {
            color: var(--color-accent);
        }
    }
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
