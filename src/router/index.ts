import { createRouter, createWebHistory } from 'vue-router'
import CardListView from '../views/CardListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cards',
      name: 'cards',
      component: CardListView
    },
    {
      path: '/card/:id',
      name: 'card',
      component:  () => import('../views/CardView.vue')
    },
    {
      path: '/upgrades',
      name: 'upgrades',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UpgradeView.vue')
    },
    {
      path:'/tags',
      name:'tags',
      component:() => import('../views/TagsView.vue')
    }
  ]
})

export default router
