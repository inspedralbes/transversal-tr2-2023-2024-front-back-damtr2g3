<script setup>
import { useAppStore } from '../store/app';
import OpcionsCombat from './OpcionsCombat.vue';
import Enemic from './Enemic.vue';
import Jugador from './Jugador.vue';
import { socket } from '@/services/socket';
</script>

<script>

export default {
  components: {
    Enemic,
    Jugador,
    OpcionsCombat
  },
  setup() {
    const store = useAppStore();

    return {
      store,
    };
  },
  methods: {

  },
  computed: {
  },
};
</script>
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

