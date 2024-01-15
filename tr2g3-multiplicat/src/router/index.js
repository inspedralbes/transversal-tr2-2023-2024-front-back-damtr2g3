// Composables
import { createRouter, createWebHashHistory } from "vue-router";
import CombatScreen from "@/components/CombatScreen.vue";
import JoinGame from "@/components/JoinGame.vue";
import CreateGame from "@/components/CreateGame.vue";
import FinishScreen from "@/components/FinishScreen.vue";
import LoginScreen from '@/components/LoginScreen.vue'
import MainMenu from '@/components/MainMenu.vue'
import ProfileScreen from '@/components/ProfileScreen.vue'
import StatsScreen from '@/components/StatsScreen.vue'
import opcions from '@/components/opcions.vue'

const routes = [
  {
    path: "/combat",
    name: "CombatScreen",
    component: CombatScreen,
  },
  {
    path: "/JoinGame",
    name: "JoinGame",
    component: JoinGame,
  },
  {
    path: "/CreateGame",
    name: "CreateGame",
    component: CreateGame,
  },
  {
    path: "/FinishScreen",
    name: "FinishScreen",
    component: FinishScreen,
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
    path:'/options',
    name:'Opcions',
    component: opcions
  },
  {
    path: '/',
    name: 'Login',
    component: LoginScreen
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    // Redirect to login page if not authenticated
    next('/');
  } else {
    next();
  }
});
export default router;
