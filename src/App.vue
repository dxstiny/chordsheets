<script setup lang="ts">
import { RouterView } from "vue-router";
import DropImport from "./views/DropImport.vue";
</script>

<template>
    <DropImport>
        <RouterView />
    </DropImport>
</template>

<style>
#app {
    min-height: 100vh;
    min-height: 100svh;
}
</style>
