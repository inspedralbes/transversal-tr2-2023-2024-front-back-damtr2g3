<script>
import { useAppStore } from '../store/app';
import OpcionsCombat from './OpcionsCombat.vue';
import Enemic from './Enemic.vue';
import Jugador from './Jugador.vue';
import { onMounted, ref } from 'vue';
import { socket } from '@/services/socket';
import { useRouter } from 'vue-router'
import router from '@/router';

export default {
  components: {
    Enemic,
    Jugador,
    OpcionsCombat
  },
  setup() {
    const store = useAppStore();
    let playerRankings = ref([]);

    socket.on("player list", (players) => {
      store.players = players;
      playerRankings.value = store.players;
    });

    return {
      store,
      playerRankings,
    };
  },
};
</script>

<template>
  <v-app>
    <v-row>
      <v-col>
        <div v-for="player in playerRankings" :key="player.id">
          {{ player.name }}: {{ player.score }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col offset="4" class="mt-12">
        <Enemic />
      </v-col>
    </v-row>
    <v-row>
      <v-col offset="3">
        <Jugador />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <OpcionsCombat />
      </v-col>
    </v-row>
  </v-app>
</template>
