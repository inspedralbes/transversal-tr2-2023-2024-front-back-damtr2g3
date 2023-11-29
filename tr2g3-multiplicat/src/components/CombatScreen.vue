<template>
  <v-app>
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

<script>
import { useAppStore } from '../store/app';
import OpcionsCombat from './OpcionsCombat.vue';
import Enemic from './Enemic.vue';
import Jugador from './Jugador.vue';
import io from 'socket.io-client';

export default {
  components: {
    Enemic,
    Jugador,
    OpcionsCombat
  },
  data() {
    return {
      socket: null,
      store
    };
  },
  methods: {

  },
  computed: {
  },
  mounted() {
    const store = useAppStore();
    this.socket = io('http://localhost:3001');
  }
};
</script>

;