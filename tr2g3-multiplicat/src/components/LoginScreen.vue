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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
    
    
    <script>
    import { validateLogin } from '@/CommunicationsManager';
    import { useAppStore } from '../store/app';
    export default {
      data() {
        return {
          username: '',
          password: '',
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