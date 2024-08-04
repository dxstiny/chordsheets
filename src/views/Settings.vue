<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import { useSongStore } from "@/stores/songs";
import { ref } from "vue";
import Import from "@/components/modals/Import.vue";
import Switch from "@/components/Switch.vue";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();
const store = useSongStore();
const importDialog = ref<typeof Import>();

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
    importDialog.value?.show();
};
</script>
<template>
    <Import ref="importDialog" />
    <div class="grid">
        <div class="container options">
            <h2>Library</h2>
            <IconButton
                icon="file_download"
                label="Save Library"
                @click="exportLib"
                :style="'yellow'"
            />
            <IconButton
                icon="file_upload"
                label="Import Library"
                @click="importLib"
                :style="'yellow'"
            />
        </div>
        <aside class="container w-2 learn">
            <div class="content">
                <div class="space-between">
                    <div>
                        <h2>New editor</h2>
                        <p>
                            The new editor lets you edit your songs directly
                            in-place. No more switching between editor and
                            preview. It also introduces new shortcuts to improve
                            your workflow.
                        </p>
                    </div>
                    <Switch
                        class="try-new-editor"
                        v-model="settings.newEditor"
                    />
                </div>
            </div>
        </aside>
    </div>
</template>

<style scoped>
.learn a h2 {
    cursor: pointer;
    color: var(--color-heading);
    transition: all 0.2s ease-in-out;

    &:hover {
        text-decoration: underline;
        color: var(--accent);
    }
}

.options {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.space-between {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;
    justify-content: space-between;
}

.toolbar {
    background: var(--color-background);
    position: sticky;
    z-index: 1;
    top: 0;
    padding-top: 1em;
}

.title {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 0.25em 0 1em;

    & img {
        width: 50px;
        aspect-ratio: 1/1;
    }

    & h1 .accent {
        color: var(--accent);
        font-weight: 900;
    }
}

.try-new-editor {
    margin-top: 1em;
}

main {
    grid-column: 1;
}

aside {
    grid-column: 2;
}

progress {
    width: 100%;
    height: 1rem;
    border: none;
    border-radius: 0.5rem;
    appearance: none;

    &::-webkit-progress-bar {
        border-radius: 0.5rem;
        background-color: var(--color-background);
    }

    &::-webkit-progress-value {
        border-radius: 0.5rem;
        background-color: var(--accent);
    }
}

.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;

    & button {
        flex: 1;
    }
}

.filters {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
}

.card {
    &.min-h-screen {
        min-height: calc(100vh - 2em);
        min-height: calc(100svh - 2em);
    }

    &.learn {
        @media (max-width: 800px) {
            min-height: 0;
        }
    }

    &.sticky {
        position: sticky;
        margin-top: 1em;
        top: 1em;
    }
}

.song {
    display: grid;
    grid-template-columns: max-content 1fr 100px 30px max-content;
    align-items: center;
    gap: 1em;
    color: var(--color-text);
    border-radius: 1em;
    padding: 0.5em 1em;
    border: 1px solid transparent;

    @media screen and (max-width: 400px) {
        grid-template-columns: max-content 1fr max-content;
        font-size: 0.8em;

        .bpm,
        .key {
            display: none;
        }
    }

    & span {
        text-align: center;
    }

    .delete {
        padding-left: 1em;
    }

    &:hover {
        background: var(--color-background-soft);
        border: 1px solid var(--color-border);
    }
    .material-symbols-rounded {
        font-size: 1.5rem;
        cursor: pointer;

        &:hover {
            color: var(--color-heading);
        }
    }

    .cover {
        overflow: hidden;
        display: flex;
        align-items: center;

        & img {
            width: 50px;
            aspect-ratio: 1/1;
            border-radius: 0.5em;

            @media screen and (max-width: 400px) {
                width: 30px;
            }
        }
    }
}

.dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1em;

    .wrap {
        display: grid;
        grid-template-columns: 1fr 300px;
        position: relative;
        gap: 1em;
        min-width: 100%;
        align-items: start;

        @media (max-width: 800px) {
            grid-template-columns: 1fr;
        }

        @media (min-width: 1400px) {
            max-width: 1400px;
            min-width: 1400px;
        }
    }
}

hr {
    margin: 1em 0;
    border: none;
    border-bottom: 1px solid var(--color-border);
}

h2 {
    font-size: 1.25em;
    font-weight: 500;
}

.parent {
    position: absolute;
    top: 0;
    left: 0;

    & > * {
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
