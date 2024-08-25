<script setup lang="ts">
import { useSongStore } from "@/stores/songs";
import Editor from "../editor2/Editor.vue";
import { useSetlistStore } from "@/stores/setlists";
import { useRouter } from "vue-router";
import type { ISetlist } from "@/types";

const setlistStore = useSetlistStore();
const router = useRouter();

const addSetlist = () => {
    const { id } = setlistStore.addEmptySetlist();
    router.push("/setlists/edit/" + id);
};

const duplicate = (setlist: ISetlist) => {
    const { id } = setlistStore.duplicateSetlist(setlist);
    router.push("/setlists/edit/" + id);
};
</script>

<template>
    <div class="grid">
        <div
            class="container clickable add-setlist"
            @click="addSetlist"
        >
            <h2 class="align-centre">
                <span class="material-symbols-rounded">add</span>
                Create Setlist
            </h2>
        </div>
        <router-link
            v-for="setlist in setlistStore.setlists"
            :to="`/setlists/edit/${setlist.id}`"
        >
            <div class="container clickable setlist">
                <div class="info">
                    <h2>{{ setlist.name }}</h2>
                    <p>
                        {{ setlist.sections.flatMap((x) => x.songs).length }}
                        songs
                    </p>
                </div>
                <div class="actions">
                    <span
                        @click.prevent.stop="duplicate(setlist)"
                        class="material-symbols-rounded"
                        >content_copy</span
                    >
                    <span
                        @click.prevent.stop="
                            setlistStore.removeSetlist(setlist)
                        "
                        class="material-symbols-rounded delete"
                    >
                        delete
                    </span>
                </div>
            </div>
        </router-link>
    </div>
</template>

<style scoped>
.add-setlist {
    background: var(--color-green);
    border-radius: 1em;
    padding: 1em;
    cursor: pointer;
    display: flex;
    justify-content: center;

    & h2 {
        color: var(--color-background);
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    &:hover {
        background: var(--color-green-dark) !important;
    }
}

.setlist {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 1em;

    & span {
        cursor: pointer;
        color: var(--color-heading);

        &:hover {
            color: var(--accent);
        }

        &.delete:hover {
            color: var(--color-red);
        }
    }
}
</style>
