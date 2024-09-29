<script lang="ts" setup>
import { useSongStore } from "@/stores/songs";
import { ref } from "vue";
import { jsPDF } from "jspdf";
import Editor from "./editor2/Editor.vue";
import QuickActionMenu from "@/components/QuickActionMenu.vue";

const store = useSongStore();
const allPages = ref<InstanceType<typeof Editor>[]>();
const renderDialog = ref<HTMLDialogElement>();
const renderProgress = ref(-1);

const renderAll = async () => {
    renderDialog.value?.showModal();
    let pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    renderProgress.value = 0;

    const pages = allPages.value ?? [];

    for (const [index, page] of pages.entries()) {
        console.log(page.name());

        await page.renderTo(pdf);
        renderProgress.value++;

        if (index < pages.length - 1) {
            pdf.addPage();
        }
    }

    renderDialog.value?.close();
    renderProgress.value = -1;

    return pdf;
};

const printAll = async () => {
    const pdf = await renderAll();
    pdf.autoPrint();
    pdf.output("dataurlnewwindow");
};

const exportAll = async () => {
    const pdf = await renderAll();
    pdf.save("chordsheets.pdf");
};
</script>
<template>
    <div class="content">
        <h1>What would you like to do today?</h1>
        <div class="search">
            <QuickActionMenu
                start-collapsed
                :features="[
                    'export',
                    'print',
                    'setlist.create',
                    'settings',
                    'song.create',
                    'learn'
                ]"
                @print="printAll"
                @export="exportAll"
            />
        </div>
    </div>
    <dialog ref="renderDialog">
        <div class="content">
            <div class="preview-container">
                <div class="preview scale-sm">
                    <Editor
                        printing
                        v-if="renderProgress >= 0"
                        :song="store.songs[renderProgress]"
                    />
                </div>
            </div>
            <h2>Rendering...</h2>
            <p>
                Please wait while we render your chord sheets. This may take a
                while.
            </p>
            <div class="row">
                <progress
                    :value="renderProgress"
                    :max="allPages?.length"
                />
                <p>
                    <span>{{ renderProgress }}</span> / {{ allPages?.length }}
                </p>
            </div>
        </div>
    </dialog>
    <div class="void">
        <div class="parent">
            <Editor
                ref="allPages"
                v-for="song in store.songs"
                printing
                :song="song"
            />
        </div>
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

.toolbar {
    background: var(--color-background);
    position: sticky;
    z-index: 1;
    top: -1px;
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

main > .content {
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    width: calc(70ch + 2em);
    overflow: clip;

    .search {
        background: var(--color-background-soft);
        border: 1px solid var(--color-border);
        border-radius: 1em;
        padding: 1em;
    }
}
</style>
