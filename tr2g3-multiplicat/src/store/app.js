import { defineStore } from 'pinia';
import preguntes from './preguntes.json'; // Asumeix que el fitxer JSON es diu 'preguntas.json' i està en el mateix directori

export const useAppStore = defineStore('app', {
  state: () => ({
    preguntes: preguntes,
    enemyLife: 100,
    maxLife: 100,
  }),
  actions: {
    reduirVidaEnemic(quantitat) {
      this.enemyLife -= quantitat;
    },
  },
});
