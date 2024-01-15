import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    //Jugador
    user: {
      imatge: "./TobishimiB5.png",
      puntuacio: 0,
      isAttacking: false,
    },
    //Enemic
    enemic: {
      imatge: "./Phenelpha.png",
      enemyLife: 100,
      maxLife: 100,
      isHit: false,
      isDodging: false,
    },
    loginInfo: {
      loggedIn: false,
      username: "",
      image: "",
      id: "",
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
    getHit() {
      setTimeout(() => {
        this.enemic.isHit = true;
        setTimeout(() => {
          this.enemic.isHit = false;
        }, 1000);
      }, 500);
    },
    dodge() {
      this.enemic.isDodging = true;
      setTimeout(() => {
        this.enemic.isDodging = false;
      }, 1000);
    },
    setLoginInfo({ loggedIn, username, image, id }) {
      this.loginInfo.loggedIn = loggedIn;
      this.loginInfo.username = username;
      this.loginInfo.image = image;
      this.id = id;
    },
    isLoggedIn() {
      return this.loginInfo.loggedIn;
    },
    getLoginInfo() {
      return this.loginInfo;
    },
    logejarUser(username) {
      this.loggedIn = true;
      this.username = username;
    },
  },
});
