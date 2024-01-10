// Composables
import { createRouter, createWebHashHistory } from "vue-router";
import CombatScreen from "@/components/CombatScreen.vue";
import JoinGame from "@/components/JoinGame.vue";
import CreateGame from "@/components/CreateGame.vue";
import FinishScreen from "@/components/FinishScreen.vue";

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
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
