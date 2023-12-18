import { defineStore } from 'pinia';
import preguntes from './preguntes.json'; // Asumeix que el fitxer JSON es diu 'preguntes.json' i està en el mateix directori

export const useAppStore = defineStore('app', {
  state: () => ({
    loginInfo: {
      loggedIn: false,
      username: '',
      image: '',
    },
    preguntes: preguntes,

    //Jugador
    user: {
      imatge: 'https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png',
      puntuacio: 0,
    },
    
    //Enemic
    enemic: {
      imatge: 'https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png',
      enemyLife: 100,
      maxLife: 100,
    },
    fonsDePantalla:background,
  }),
  actions: {
    setLoginInfo({ loggedIn, username, image }) {
      this.loginInfo.loggedIn = loggedIn;
      this.loginInfo.username = username;
      this.loginInfo.image = image;
    },
    reduirVidaEnemic(quantitat) {
      this.enemic.enemyLife -= quantitat;
    },
    isLoggedIn(){
      return this.loginInfo.loggedIn;
    },
    getLoginInfo(){
      return this.loginInfo;
    },
    logejarUser(username){
      this.loggedIn=true;
      this.username=username
    },

  },
});
