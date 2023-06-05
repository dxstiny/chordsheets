<script lang="ts" setup>
import { useSongStore } from "@/stores/songs";

const store = useSongStore();
</script>
<template>
    <div class="dashboard">
        <div class="wrap">
            <h1>Chordsheets</h1>

            <hr />
            <router-link to="/editor">New Song</router-link>
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
