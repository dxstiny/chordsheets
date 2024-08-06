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
            path: "/browse",
            name: "Songs",
            component: () => import("../views/Songs.vue")
        },
        {
            path: "/settings",
            name: "Settings",
            component: () => import("../views/Settings.vue")
        },
        {
            path: "/editor/v2/:id",
            name: "EditorNext",
            component: () => import("../views/editor2/index.vue")
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
            component: () => import("../views/learn/index.vue"),
            children: [
                {
                    path: "scale-finder",
                    name: "Scale Finder",
                    component: () => import("../views/learn/ScaleFinder.vue")
                },
                {
                    path: "Scales",
                    name: "Scales",
                    component: () => import("../views/learn/Scales.vue")
                },
                {
                    path: "scale-quiz",
                    name: "Scale Quiz",
                    component: () => import("../views/learn/ScaleQuiz.vue")
                },
                {
                    path: "chord-finder",
                    name: "Chord Finder",
                    component: () => import("../views/learn/ChordFinder.vue")
                },
                {
                    path: "chord-progressions",
                    name: "Chord Progressions",
                    component: () =>
                        import("../views/learn/ChordProgressions.vue")
                }
            ]
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
