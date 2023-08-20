<script setup lang="ts">
import { type PropType, ref, onMounted } from "vue";
import type { ISong, PageContent } from "@/types";
import Page from "./Page.vue";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import domToImage from "dom-to-image";

const props = defineProps({
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
});

const allpageselement = ref<HTMLElement>();
const parent = ref<HTMLElement[]>();
const element = ref<InstanceType<typeof Page>[]>();
onMounted(() => {
    const firstParent = parent.value?.[0];
    if (!firstParent) return;
    const newPages = [];

    const sections = element.value?.[0]?.getSections();
    if (!sections) return;
    const lookup = [...props.song.sections, ...(props.song.midi ?? [])];

    for (let i = 0; i < sections.length; i++) {
        const sectionElement = sections[i];
        const section = lookup[i];

        // height + y-position
        const bottom = sectionElement.getBoundingClientRect().bottom;

        // of parent
        const parentBottom: number =
            firstParent?.getBoundingClientRect().bottom ?? 0;

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

const renderTo = async (pdf: jsPDF) => {
    if (!allpageselement.value) return pdf;
    const elements = allpageselement.value.querySelectorAll(
        ".parent__element"
    ) as NodeListOf<HTMLElement>;
    let el = elements[0];

    const ratio = el.clientHeight / el.clientWidth;

    for (let i = 0; i < pages.value.length; i++) {
        el = elements[i];
        if (!el) continue;

        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();

        const scale = 2;
        const dataUrl = await domToImage.toJpeg(el, {
            height: el.offsetHeight * scale,
            width: el.offsetWidth * scale,
            style: {
                transform: `scale(${scale}) translate(${
                    el.offsetWidth / 2 / scale
                }px, ${el.offsetHeight / 2 / scale}px)`
            }
        });

        height = ratio * width;
        /*
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        svg.innerHTML = dataUrl;
        await pdf.svg(svg, {
            x: 0,
            y: 0,
            width,
            height
        });*/
        pdf.addImage(dataUrl, "JPG", 0, 0, width, height);

        if (i + 1 < pages.value.length) {
            pdf.addPage();
        }
    }
    return pdf;
};

const render = async () => {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    await renderTo(pdf);

    return pdf;
};

const pages = ref<PageContent[][]>([
    [...props.song.sections, ...(props.song.midi ?? [])]
]);

if (pages.value[0].length === 0) {
    pages.value = [[null]];
}

defineExpose({
    render,
    renderTo,
    song: props.song
});
</script>
<template>
    <div
        ref="allpageselement"
        id="allPages"
    >
        <div
            class="print a4 parent__element"
            ref="parent"
            v-for="(_, i) in pages"
        >
            <div class="wrap">
                <Page
                    class="page__element"
                    ref="element"
                    :song="song"
                    :pages="pages"
                    :currentPage="i"
                />
            </div>
        </div>
    </div>
</template>
<style scoped>
.wrap {
    width: 100%;
}
</style>
