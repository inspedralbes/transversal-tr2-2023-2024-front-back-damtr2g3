// Composables
import { createRouter, createWebHistory } from "vue-router";
import CombatScreen from "@/components/CombatScreen.vue";
import JoinGame from "@/components/JoinGame.vue";
import CreateGame from "@/components/CreateGame.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
