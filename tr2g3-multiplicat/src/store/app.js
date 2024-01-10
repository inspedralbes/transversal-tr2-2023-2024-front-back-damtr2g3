import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    //Jugador
    user: {
      imatge:
        "https://img.pokemondb.net/sprites/black-white/anim/back-normal/infernape.gif",
      puntuacio: 0,
      isAttacking: false,
    },

    //Enemic
    enemic: {
      imatge:
        "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-black-and-white/9/99/Pokemans_493.gif",
      enemyLife: 100,
      maxLife: 100,
      isHit: false,
      isDodging: false,
    },
  }),
  actions: {
    reduirVidaEnemic(quantitat) {
      this.enemic.enemyLife -= quantitat;
    },
    attack() {
      this.user.isAttacking = true;
      setTimeout(() => {
        this.user.isAttacking = false;
      }, 1000);
    },
    getHit(){
      setTimeout(() => {
        this.enemic.isHit = true;
        setTimeout(() => {
          this.enemic.isHit = false;
        }, 1000);
      }, 500);
    },
    dodge(){
      this.enemic.isDodging = true;
      setTimeout(() => {
        this.enemic.isDodging = false;
      }, 1000);
    },
  },
});
