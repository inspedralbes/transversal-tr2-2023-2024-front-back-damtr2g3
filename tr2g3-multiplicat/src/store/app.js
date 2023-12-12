import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    //Jugador
    user: {
      imatge:
        "https://img.pokemondb.net/sprites/black-white/anim/back-normal/infernape.gif",
      puntuacio: 0,
    },

    //Enemic
    enemic: {
      imatge:
        "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-black-and-white/9/99/Pokemans_493.gif",
      enemyLife: 100,
      maxLife: 100,
    },
  }),
  actions: {
    reduirVidaEnemic(quantitat) {
      this.enemic.enemyLife -= quantitat;
    },
  },
});
