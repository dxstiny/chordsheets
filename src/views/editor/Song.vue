<script lang="ts" setup>
import type { ISong, ISection } from "@/types";
import Page from "./Page.vue";
import { ref, type PropType, onMounted } from "vue";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useSongStore } from "@/stores/songs";

const store = useSongStore();

const props = defineProps({
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
});

const allPages = ref<HTMLElement[]>();
const mainPage = ref<InstanceType<typeof Page>>();
const element = ref<HTMLDivElement>();
const pages = ref<ISection[][]>([props.song.sections]);
const currentPage = ref(0);

onMounted(() => {
    if (!element.value) return;
    const newPages = [];

    const sections = mainPage.value?.getSections().value;
    if (!sections) return;

    for (let i = 0; i < sections.length; i++) {
        const sectionElement = sections[i];
        const section = props.song.sections[i];

        // height + y-position
        const bottom = sectionElement.getBoundingClientRect().bottom;

        // of parent
        const parentBottom: number =
            element.value?.getBoundingClientRect().bottom ?? 0;

        // get page
        const page = Math.ceil(bottom / parentBottom) - 1;
        // if page is not in pages
        if (!newPages[page]) {
            // add page
            newPages[page] = [section];
            continue;
        }
        // add section to page
        newPages[page].push(section);
    }

    pages.value = newPages;
});

const nextPage = () => {
    if (currentPage.value + 1 >= pages.value.length) return;
    currentPage.value++;
};

const prevPage = () => {
    if (currentPage.value - 1 < 0) return;
    currentPage.value--;
};

const getCurrentPage = () => {
    return currentPage.value + 1;
};

const getTotalPages = () => {
    return pages.value.length;
};

const render = async () => {
    let el = allPages.value?.[0];
    if (!el) return null;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    const ratio = el.clientHeight / el.clientWidth;

    for (let i = 0; i < pages.value.length; i++) {
        el = allPages.value?.[i];
        if (!el) continue;

        const dataUrl = (
            await html2canvas(el, {
                scale: 5
            })
        ).toDataURL();

        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        height = ratio * width;

        pdf.addImage(dataUrl, "PNG", 0, 0, width, height);

        if (i + 1 < pages.value.length) {
            pdf.addPage();
        }
    }

    return pdf;
};

const print = async () => {
    await store.prepareRender();
    const pdf = await render();
    if (!pdf) return;
    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");
};

const download = async () => {
    await store.prepareRender();
    const pdf = await render();
    if (!pdf) return;
    pdf.save(`${props.song.title}.pdf`);
};

defineExpose({
    nextPage,
    prevPage,
    getCurrentPage,
    getTotalPages,
    download,
    print
});
</script>
<template>
    <div
        class="parent"
        ref="element"
    >
        <div class="song printable">
            <div class="wrap">
                <Page
                    ref="mainPage"
                    :song="song"
                    :pages="pages"
                    :currentPage="currentPage"
                />
            </div>
        </div>

        <div class="void">
            <div
                class="print a4"
                v-for="(_, i) in pages"
                ref="allPages"
            >
                <div class="wrap">
                    <Page
                        :song="song"
                        :pages="pages"
                        :currentPage="i"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.parent {
    width: 100%;

    .void {
        position: fixed;
        top: 0;
        left: 0;
        background: red;
        z-index: -100;

        .preview {
            border-radius: 0 2rem 2rem 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 1em;
            padding: 0 10em;

            margin-bottom: 1em;
        }
    }

    .song {
        width: 100%;
    }

    .capitalise {
        text-transform: capitalize;
    }

    .instruments {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;

        .instrument {
            border: 1px solid var(--color-border);
            border-radius: 0.5em;
            padding: 0.5em;

            & h3 {
                font-weight: 900;
            }

            .muted {
                font-style: italic;
                text-transform: uppercase;
                font-size: 0.7rem;
                letter-spacing: 0.1em;
            }

            .flex {
                display: flex;
                flex-direction: row;
                align-items: center;
                text-transform: uppercase;

                &.space-between {
                    justify-content: space-between;
                }

                &.gap-2 {
                    gap: 0.5em;
                }
            }
        }
    }

    .song h1 {
        font-size: 1.5rem;
    }

    .song h2 {
        font-size: 0.8rem;
        text-transform: uppercase;
    }

    .material-symbols-rounded {
        font-size: 1em;
    }

    .wrap-to-line {
        display: flex;
        flex-direction: row;
        align-items: center;

        .info {
            display: flex;
            align-items: center;
            gap: 0.5em;

            &:not(:last-child) {
                margin-right: 1em;
                padding-right: 1em;

                &:after {
                    content: " ";
                    width: 1px;
                    height: 100%;
                    display: block;
                    position: absolute;
                    right: 0;
                    top: 0;
                    background: var(--color-border);
                }
            }

            &.option {
                &.active {
                    color: var(--color-primary);
                }
            }
        }
    }

    & hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: 1em 0;
    }

    .section {
        &:not(:last-child) {
            margin-bottom: 1em;
        }

        & span {
            text-transform: uppercase;
            font-size: 0.8rem;
            font-weight: bold;
        }
    }

    .progression {
        display: grid;
        grid-template-columns: repeat(16, 1fr);
        grid-gap: 1em;
        align-items: center;
        grid-template-rows: auto;
    }

    .progression > div {
        display: flex;
        justify-content: center;
        border: 1px solid var(--color-border);
        border-radius: 0.5em;
    }

    .progression .w-1 {
        grid-column: span 1;
    }
    .progression .w-2 {
        grid-column: span 2;
    }
    .progression .w-3 {
        grid-column: span 3;
    }
    .progression .w-4 {
        grid-column: span 4;
    }
    .progression .w-5 {
        grid-column: span 5;
    }
    .progression .w-6 {
        grid-column: span 6;
    }
    .progression .w-8 {
        grid-column: span 8;
    }
    .progression .w-10 {
        grid-column: span 10;
    }
    .progression .w-12 {
        grid-column: span 12;
    }
    .progression .w-14 {
        grid-column: span 14;
    }
    .progression .w-16 {
        grid-column: span 16;
    }

    .progression .selected {
        font-weight: 900;
        color: var(--accent);
        border-color: var(--accent);
    }
}
</style>

<style>
@media print {
    *:not(.printable, .printable *) {
        display: none;
    }
}
</style>
