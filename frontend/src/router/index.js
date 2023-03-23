import {createRouter, createWebHashHistory} from 'vue-router';
import MainPage from '@/components/MainPage.vue'
import WebGLTest from '@/components/WebGLTest'
import ComTest from '@/components/ComTest'

const routerHistory = createWebHashHistory();

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage,
    },
    {
        path: '/WebGLTest',
        name: 'WebGLTest',
        component: WebGLTest,
    },
    /*{
        path: '/WebGLTest',
        name: 'WebGLTest',
        component: WebGLTest,
    },*/
    {
        path: '/ComTest',
        name: 'ComTest',
        component: ComTest,
    },
];

const router = createRouter({
    history: routerHistory,
    routes
});

export default router;