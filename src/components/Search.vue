<script setup lang="ts">
import {
    type PropType,
    ref,
    computed,
    onMounted,
    onUnmounted,
    watch
} from "vue";
import { debounce } from "lodash";
import { loadText } from "@/textLoader";

export type Item = {
    id: any;
    title: string;
    subtitle: string;
    img?: string;
    icon?:
        | {
              name: string;
              tint: "green" | "red" | "blue" | "yellow";
          }
        | string;
    action?: (param: { item: Item; query: string }) => void;
    data?: any;
};

const query = ref("");
const results = ref<Item[]>([]);
const selection = ref<number>(-1);
const windowSelector = ref(0);
const searchField = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);
const placeholderIndex = ref(0);
const placeholderInterval = ref(0);

const props = defineProps({
    startCollapsed: {
        type: Boolean,
        default: false
    },
    autoFocus: {
        type: Boolean,
        default: true
    },
    search: {
        type: Object as PropType<(query: string) => Item[]>,
        required: true
    },
    rotatingPlaceholder: {
        type: Array as PropType<string[]>,
        default: () => ["Search..."]
    }
});

const placeholderText = ref(props.rotatingPlaceholder[0] ?? "Search...");

const expanded = ref(!props.startCollapsed);

const search = debounce(() => {
    results.value = props.search(query.value);
    expanded.value = true;
}, 300);

// ctrl+k or ctrl+f
const onKeyDown = (e: KeyboardEvent) => {
    if (!isFocused.value) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selection.value < 2) {
            selection.value = Math.min(
                selection.value + 1,
                results.value.length - 1
            );
        } else if (windowSelector.value < results.value.length - 3) {
            windowSelector.value = Math.min(
                windowSelector.value + 1,
                results.value.length - 1
            );
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selection.value > 0) {
            selection.value = Math.max(selection.value - 1, 0);
        } else if (windowSelector.value > 0) {
            windowSelector.value = Math.max(windowSelector.value - 1, 0);
        }
    } else if (e.key === "Enter") {
        e.preventDefault();
        select(results.value[selection.value + windowSelector.value]);
    }
};

const select = (elem: Item) => {
    elem.action?.({ item: elem, query: query.value });
    emit("select", elem);
    searchField.value?.select();
};

const showResults = computed(() => {
    return results.value.slice(
        windowSelector.value,
        Math.min(windowSelector.value + 3, results.value.length)
    );
});

watch(
    () => props.rotatingPlaceholder,
    () => startPlaceholderRotation()
);

const startPlaceholderRotation = () => {
    window.clearInterval(placeholderInterval.value);
    placeholderIndex.value = 0;
    placeholderInterval.value = window.setInterval(() => {
        placeholderIndex.value =
            (placeholderIndex.value + 1) % props.rotatingPlaceholder.length;
        loadText(props.rotatingPlaceholder[placeholderIndex.value], (str) => {
            placeholderText.value = str;
        });
    }, 5000);
};

onMounted(() => {
    window.addEventListener("keydown", onKeyDown);

    if (searchField.value && props.autoFocus) {
        searchField.value.focus();
    }

    if (!props.startCollapsed) {
        results.value = props.search(query.value);
        expanded.value = true;
    }

    if (props.rotatingPlaceholder.length > 1) {
        startPlaceholderRotation();
    }
});
onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
});

const searchResultsHeight = computed(() => {
    return (showResults.value.length * 86.6 || 26) + "px";
});

const icon = (item: Item) => {
    if (typeof item.icon === "string") {
        return item.icon;
    } else if (item.icon) {
        return item.icon.name;
    }
};

const iconColour = (item: Item) => {
    if (typeof item.icon === "object") {
        return item.icon.tint;
    } else {
        return "green";
    }
};

const emit = defineEmits(["select"]);
</script>
<template>
    <div
        class="content"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
    >
        <input
            type="text"
            :placeholder="placeholderText"
            v-model="query"
            ref="searchField"
            @input="search"
        />
        <div
            class="search-results"
            v-if="expanded"
            :style="{
                maxHeight: searchResultsHeight,
                height: searchResultsHeight
            }"
        >
            <div
                v-for="result in showResults"
                :key="result.id"
                tabindex="0"
                @click="select(result)"
                @keydown.enter.prevent.stop="select(result)"
                class="song"
                :class="{
                    selected:
                        selection + windowSelector === results.indexOf(result)
                }"
            >
                <div class="cover">
                    <div
                        class="icon"
                        :class="iconColour(result)"
                        v-if="result.icon"
                    >
                        <span class="material-symbols-rounded">
                            {{ icon(result) }}
                        </span>
                    </div>
                    <img
                        v-else
                        :src="result.img || 'placeholders/song.svg'"
                    />
                </div>
                <div class="info">
                    <h2>{{ result.title }}</h2>
                    <span>{{ result.subtitle }}</span>
                </div>
            </div>
            <span v-if="results.length === 0">No results found</span>
        </div>
        <span v-if="results.length && expanded">
            {{ results.length }}
            {{ results.length === 1 ? "result" : "results" }}
        </span>
    </div>
</template>

<style scoped>
input {
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    background: none;
    width: calc(100%);
    font-size: 1.2rem;
    min-width: 50ch;
    padding: 0.5rem;
    font-family: inherit;
    color: var(--color-heading);
}

.content {
    width: 100%;
}

.search-results {
    display: grid;
    align-content: start;
    gap: 0.5rem;
    padding: 0.5rem;
    overflow: clip;
    height: 100%;

    transition: all 0.3s ease-in-out;
}

.song {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 1em;
    color: var(--color-text);
    border-radius: 1em;
    padding: 0.5em 1em;
    border: 1px solid transparent;
    isolation: isolate;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    .info {
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        align-items: start;
    }

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

    &:hover,
    &:focus,
    &.selected {
        background: var(--color-background-soft);
        border: 1px solid var(--color-border);
        outline: none;
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

        & div.icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;

            background: linear-gradient(
                45deg,
                var(--color-green),
                var(--color-green-dark)
            );

            &.red {
                background: linear-gradient(
                    45deg,
                    var(--color-red),
                    var(--color-red-dark)
                );
            }

            &.blue {
                background: linear-gradient(
                    45deg,
                    var(--color-blue),
                    var(--color-blue-dark)
                );
            }

            &.yellow {
                background: linear-gradient(
                    45deg,
                    var(--color-yellow),
                    var(--color-yellow-dark)
                );
            }
        }

        & img,
        div.icon {
            width: 50px;
            aspect-ratio: 1/1;
            border-radius: 0.5em;

            @media screen and (max-width: 400px) {
                width: 30px;
            }
        }
    }
}

.info span {
    white-space: nowrap;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
}

h2 {
    font-size: 1.25em;
    font-weight: 500;
}
</style>
