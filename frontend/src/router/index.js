import {createRouter, createWebHashHistory} from 'vue-router';
import MainPage from '@/views/MainPage.vue'
import WebGLPage from '@/views/WebGLPage'
import ComTestPage from '@/views/ComTestPage'
import BabylonDemo from '@/components/BabylonDemo'
import MgeoDemo from '@/components/MgeoDemo'

const routerHistory = createWebHashHistory();

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage,
    },
    {
        path: '/WebGLPage',
        name: 'WebGLPage',
        component: WebGLPage,
    },
    {
        path: '/BabylonDemo',
        name: 'BabylonDemo',
        component: MgeoDemo,
    },
    {
        path: '/ComTestPage',
        name: 'ComTestPage',
        component: ComTestPage,
    },
    {
        path: '/MgeoDemo',
        name: 'MgeoDemo',
        component: MgeoDemo,
    }
];

const router = createRouter({
    history: routerHistory,
    routes
});

export default router;