import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/ref-reactive',
      name: 'ref-reactive',
      component: () => import('../views/practice/RefReactiveView.vue'),
    },
    {
      path: '/computed-watch',
      name: 'computed-watch',
      component: () => import('../views/practice/ComputedWatchView.vue'),
    },
    {
      path: '/props-emit',
      name: 'props-emit',
      component: () => import('../views/practice/PropsEmitView.vue'),
    },
  ],
})

export default router
