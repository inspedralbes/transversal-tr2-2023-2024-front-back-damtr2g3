<template>
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- Your login form goes here -->
          <v-card style="background-color: rgba(255, 255, 255, 0.5) !important; border-color: white !important; margin-top: 300px;">
            <v-card-title class="headline">
              Login
            </v-card-title>
            <v-card-text>
              <!-- Your login form inputs go here -->
              <v-form >
                <v-text-field v-model="username" label="Username"></v-text-field>
                <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                
              </v-form>
              <v-btn @click="validateLoginBtn(username, password)" type="submit" color="primary">Login</v-btn>
              <v-btn @click="popUpRegistre=true" type="submit" color="primary">Registrat</v-btn>
              <vs-popup class="popUpRegistre"  title="Crear un nou usuari" :active.sync="popUpPasswd">
                <p>
                  Nom:<v-text-field v-model="nom" label="nom"></v-text-field>
                  Username:<v-text-field v-model="user" label="user"></v-text-field>
                  Contrasenya:<v-text-field v-model="contrasenya" label="contrasenya"></v-text-field>
                  link Foto de perfil:<v-text-field v-model="foto" label="foto"></v-text-field>
                  Correu:<v-text-field v-model="email" label="email"></v-text-field>
                  Classe:<v-text-field v-model="classe" label="classe"></v-text-field>
                  <v-btn @click="crearUser(nom,user, contrasenya, foto, email, classe)" type="submit" color="primary">Crear l'usuari</v-btn>
                </p>
              </vs-popup>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
    
    
    <script>
    import { validateLogin } from '@/CommunicationsManager';
    import { nouUsuari } from '@/CommunicationsManager';
    import { useAppStore } from '../store/app';
    export default {
      data() {
        return {
          username: '',
          password: '',
          popUpRegistre:false,
          nom:"",
          user:"",
          contrasenya:"",
          foto:"",
          email:"",
          classe:""
        };
      },
      methods: {
        GuardarLogin(username){
          this.store.loginInfo.loggedIn=true
          this.store.loginInfo.username=username
        },
        async validateLoginBtn(username, password){
          console.log("hola")
          var autoritzacio = await validateLogin(username, password);
          console.log(autoritzacio);
          if(autoritzacio.autoritzacio) {
            this.GuardarLogin(username)
            console.log('we are in');
            this.$router.push('/mainmenu');
          }else{
            console.log('you fucked up');
          }
        },
        crearUser(nom,user, contrasenya, foto, email, classe){
          nouUsuari(nom,user, contrasenya, foto, email, classe)
          this.popUpRegistre=false
        }
        
      },
      setup() {
            const store = useAppStore();
            store
            return{
              store
            }
        }
    };
    </script>
    
  <style>
  .fill-height {
      height: 100vh; /* 100% of the viewport height */
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>