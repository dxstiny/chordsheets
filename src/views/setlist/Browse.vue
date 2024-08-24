<script setup lang="ts">
import { useSongStore } from "@/stores/songs";
import Editor from "../editor2/Editor.vue";

const store = useSongStore();
</script>

<template>
    <div class="grid">
        <router-link to="/setlists/edit/1234">
            <div class="container clickable setlist">
                <h2>Setlist 1</h2>
                <p>3 songs</p>
            </div>
        </router-link>
    </div>
</template>
