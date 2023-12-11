import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: () => import("../views/Dashboard.vue")
        },
        {
            path: "/editor/:id",
            name: "EditorId",
            component: () => import("../views/editor/index.vue")
        },
        {
            path: "/editor",
            name: "EditorNew",
            component: () => import("../views/editor/index.vue")
        },
        {
            path: "/midi",
            name: "Midi",
            component: () => import("../views/midi/index.vue")
        },
        {
            path: "/learn",
            name: "Learn",
            component: () => import("../views/learn/index.vue")
        },
        {
            path: "/learn/scale-finder",
            name: "Learn - Scale Finder",
            component: () => import("../views/learn/index.vue")
        },
        {
            path: "/learn/scales",
            name: "Learn - Scales",
            component: () => import("../views/learn/index.vue")
        },
        {
            path: "/learn/scale-quiz",
            name: "Learn - Scale Quiz",
            component: () => import("../views/learn/index.vue")
        },
        {
            path: "/learn/chord-finder",
            name: "Learn - Chord Finder",
            component: () => import("../views/learn/index.vue")
        },
        {
            path: "/learn/chord-progressions",
            name: "Learn - Chord Progressions",
            component: () => import("../views/learn/index.vue")
        }
    ]
});

export default router;
