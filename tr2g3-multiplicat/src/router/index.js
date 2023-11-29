// Composables
import { createRouter, createWebHistory } from 'vue-router'
import CombatScreen from '@/components/CombatScreen.vue'
import GachaScreen from '@/components/GachaScreen.vue'

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
