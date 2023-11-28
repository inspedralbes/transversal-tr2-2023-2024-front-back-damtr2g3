<template>
  <v-app>
    <Enemic />
    <OpcionsCombat />
  </v-app>
</template>


<script>
import { useAppStore } from '../store/app';
import OpcionsCombat from './OpcionsCombat.vue';
import Enemic from './Enemic.vue';

export default {
  components: {
    OpcionsCombat,
    Enemic,
  },
  setup() {
    const store = useAppStore();

    return {
      store
    };
  }
};
</script>

