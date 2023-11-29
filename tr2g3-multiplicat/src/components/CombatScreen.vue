<template>
  <v-app>
    <Enemic  />
    <Jugador />
    <OpcionsCombat /> 
  </v-app>
</template>


<script>
import { useAppStore } from '../store/app';
import OpcionsCombat from './OpcionsCombat.vue';
import Enemic from './Enemic.vue';
import Jugador from './Jugador.vue'; 

export default {
  components: {
    OpcionsCombat,
    Enemic,
    Jugador,
  },
  setup() {
    const store = useAppStore();

    return {
      store
    };
  }
};
</script>

