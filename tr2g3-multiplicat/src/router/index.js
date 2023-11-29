// Composables
import { createRouter, createWebHistory } from 'vue-router'
import CombatScreen from '@/components/Combat/CombatScreen.vue'
import GachaScreen from '@/components/Gacha/GachaScreen.vue'

const routes = [
  {
    path: '/',
    name: 'CombatScreen',
    component: CombatScreen
  },
  {
    path: '/gacha/',
    name: 'GachaScreen',
    component: GachaScreen
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
