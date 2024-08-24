<script setup lang="ts">
import Browse from "./Browse.vue";
import Editor from "./Editor.vue";
import useRoute from "vue-router";
</script>
<template>
    <Browse v-if="$route.name == 'Setlists'" />
    <RouterView v-else />
</template>
