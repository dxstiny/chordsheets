<script setup lang="ts">
import Browse from "./Browse.vue";
</script>
<template>
    <Browse v-if="$route.name == 'Setlists'" />
    <RouterView v-else />
</template>
