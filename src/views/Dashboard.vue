<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import { useSongStore } from "@/stores/songs";

const store = useSongStore();

const exportLib = async () => {
    await store.prepareRender();

    const text = JSON.stringify(store.songs, null, 4);
    const a = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "chordsheets.json";
    a.click();
};

const importLib = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const songs = JSON.parse(text);
            store.songs = songs;
        };
        reader.readAsText(file);
    };
    input.click();
};
</script>
<template>
    <div class="dashboard">
        <div class="wrap">
            <h1>Chordsheets</h1>

            <hr />
            <div class="flex">
                <IconButton
                    icon="add"
                    label="New Song"
                    @click="$router.push('/editor')"
                />
                <IconButton
                    icon="file_download"
                    label="Export"
                    @click="exportLib"
                />
                <IconButton
                    icon="file_upload"
                    label="Import"
                    @click="importLib"
                />
            </div>
            <hr />
            <ul>
                <router-link
                    v-for="(song, index) in store.songs"
                    :to="`/editor?s=${index}`"
                >
                    <li>{{ song.artist }} - {{ song.title }}</li>
                </router-link>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
}

.dashboard {
    padding: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;

    .wrap {
        min-width: 100%;

        @media (min-width: 1200px) {
            min-width: 1200px;
        }
    }
}

hr {
    margin: 1em 0;
    border: none;
    border-bottom: 1px solid var(--color-border);
}
</style>
