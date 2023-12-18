// Composables
import { createRouter, createWebHistory } from 'vue-router'
import CombatScreen from '@/components/CombatScreen.vue'
import LoginScreen from '@/components/LoginScreen.vue'
import MainMenu from '@/components/MainMenu.vue'
import ProfileScreen from '@/components/ProfileScreen.vue'
import EndGameScreen from '@/components/EndGameScreen.vue'
import LobbyScreen from '@/components/LobbyScreen.vue'
import StatsScreen from '@/components/StatsScreen.vue'
import GachaponScreen from '@/components/GachaponScreen.vue'
import opcions from '@/components/opcions.vue'

const routes = [
  {
    path: '/',
    name: 'CombatScreen',
    component: CombatScreen
  },
  {
    path: '/userlogin',
    name: 'Login',
    component: LoginScreen
  },
  {
    path: '/mainmenu',
    name: 'Main Menu',
    component: MainMenu
  },
  {
    path: '/stats',
    name: 'User Stats',
    component: StatsScreen
  },
  {
    path: '/profile',
    name: 'User Profile',
    component: ProfileScreen
  },
  {
    path: '/gacha',
    name: 'Gachapon',
    component: GachaponScreen
  },
  {
    path: '/endgame',
    name: 'Game Finished',
    component: EndGameScreen 
  },
  {
    path: '/lobby',
    name: 'Player Lobby',
    component: LobbyScreen 
  },
  {
    path:'/options',
    name:'Opcions',
    component: opcions
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    // Redirect to login page if not authenticated
    next('/');
  } else {
    next();
  }
});

export default router
