import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateView from '@/views/CreateView.vue'
import EditView from '@/views/EditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tasks',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tasks/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/tasks/edit/:id',
      name: 'edit',
      component: EditView
    }
  ],
})

export default router
