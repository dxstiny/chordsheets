<script lang="ts" setup>
import type { ISong, ISection, PageContent } from "@/types";
import Page from "./Page.vue";
import { ref, type PropType, onMounted } from "vue";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useSongStore } from "@/stores/songs";
import AllPages from "./AllPages.vue";

const store = useSongStore();

const props = defineProps({
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
});

const allPages = ref<InstanceType<typeof AllPages>>();
const mainPage = ref<InstanceType<typeof Page>>();
const element = ref<HTMLDivElement>();
const pages = ref<PageContent[][]>([
    [...props.song.sections, ...(props.song.midi ?? [])]
]);
const currentPage = ref(0);

onMounted(() => {
    if (!element.value) return;
    const newPages = [];

    const sections = mainPage.value?.getSections();
    if (!sections) return;

    const lookup = [...props.song.sections, ...(props.song.midi ?? [])];

    for (let i = 0; i < sections.length; i++) {
        const sectionElement = sections[i];
        const section = lookup[i];

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
    if (!pages.value.length) {
        pages.value.push([null]);
    }
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
    return await allPages.value?.render();
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
                <AllPages
                    ref="allPages"
                    :song="song"
                />
            </div>
        </div>

        <div class="void">
            <Page
                ref="mainPage"
                :song="song"
                :pages="pages"
                :currentPage="currentPage"
            />
        </div>
    </div>
</template>

<style scoped>
.wrap {
    overflow: auto;
    height: 80vh;
    padding: 0 1em;
}
</style>
