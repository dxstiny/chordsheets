<script setup lang="ts">
import { onMounted, ref } from "vue";

const expanded = ref(false);
const KEY = "chordsheets.sidebar-expanded";

const setSidebarWidth = () => {
    const body = document.querySelector("body");
    if (body) {
        body.style.setProperty(
            "--sidebar-width",
            expanded.value ? "220px" : "70px"
        );
    }
};

onMounted(() => {
    expanded.value = window.localStorage.getItem(KEY) === "true";
    setSidebarWidth();
});

const toggleExpanded = () => {
    expanded.value = !expanded.value;
    window.localStorage.setItem(KEY, expanded.value.toString());
    setSidebarWidth();
};
</script>

<template>
    <aside
        class="sidebar"
        :class="{ expanded }"
    >
        <RouterLink to="/">
            <div class="title">
                <img :src="'favicon.svg'" />
                <h1>Chord<span class="accent">Sheets</span></h1>
            </div>
        </RouterLink>
        <div class="links">
            <RouterLink to="/">
                <span class="material-symbols-rounded">home</span>
                <span class="label">Home</span>
            </RouterLink>
            <RouterLink to="/browse">
                <span class="material-symbols-rounded">library_music</span>
                <span class="label">Songs</span>
            </RouterLink>
            <RouterLink to="/setlists">
                <span class="material-symbols-rounded">list</span>
                <span class="label">Setlists</span>
            </RouterLink>
            <RouterLink to="/learn">
                <span class="material-symbols-rounded">school</span>
                <span class="label">Learn</span>
            </RouterLink>
            <a
                @click="toggleExpanded"
                data-type="toggle"
            >
                <span class="material-symbols-rounded">
                    {{ expanded ? "expand_less" : "expand_more" }}
                </span>
                <span class="label">{{
                    expanded ? "Collapse" : "Expand"
                }}</span>
            </a>
            <RouterLink to="/settings">
                <span class="material-symbols-rounded">settings</span>
                <span class="label">Settings</span>
            </RouterLink>
        </div>
    </aside>
</template>

<style scoped>
aside {
    position: sticky;
    top: 1em;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: calc(100vh - 2em);

    @media (max-width: 800px) {
        z-index: 1;
        top: unset;
        bottom: 1em;
        left: 1em;
        right: 1em;
        position: fixed;
    }

    .label,
    .title h1 {
        display: none;
    }

    &.expanded {
        max-width: calc(220px + 2em);

        .label,
        .title h1 {
            display: inherit;
        }

        .links a {
            padding: 0.5em 1em;
            justify-content: flex-start;
        }
    }
}

[data-type="toggle"] {
    margin-top: 2em;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: -1em;
        left: 0;
        right: 0;
        flex: 1;
        background: var(--color-border);
        height: 1px;
        margin: 0 1em;
    }

    .material-symbols-rounded {
        transform-origin: center;
        transform: rotate(-90deg);
    }
}

.links {
    display: flex;
    flex-direction: column;

    & a {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        gap: 0.5em;
        padding: 0.5em 0;
        border-radius: 0.5em;
        transition: background-color 0.2s;
        color: var(--color-text);
        height: 42px;

        &.router-link-active {
            background: var(--color-background-soft);
            color: var(--accent);
        }

        &:hover {
            background: var(--color-background-soft);
        }
    }
}

.title {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 0.25em 0 1em;

    font-size: 0.9rem;

    & img {
        width: 35px;
        aspect-ratio: 1/1;
    }

    & h1 .accent {
        color: var(--accent);
        font-weight: 900;
    }
}

@media (max-width: 800px) {
    & aside {
        grid-row: 2;
        max-width: none !important;

        .links {
            flex-direction: row;
            justify-content: space-around;
        }

        .title,
        .label,
        [data-type="toggle"] {
            display: none !important;
        }
    }
}
</style>
