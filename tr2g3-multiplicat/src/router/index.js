// Composables
import { createRouter, createWebHistory } from 'vue-router'
import CombatScreen from '@/components/CombatScreen.vue'

const routes = [
  {
    path: '/',
    name: 'CombatScreen',
    component: CombatScreen
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
