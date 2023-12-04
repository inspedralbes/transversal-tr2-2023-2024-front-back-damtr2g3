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
                <v-btn @click="validateLoginBtn(username, password)" type="submit" color="primary">Login</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
    
    
    <script>
    import { validateLogin } from '@/CommunicationsManager';
    
    export default {
      data() {
        return {
          username: '',
          password: '',
        };
      },
      methods: {
        async validateLoginBtn(username, password){
          var autoritzacio = validateLogin(username, password);
          console.log('Logging in with:', username,", ", password);
          if(autoritzacio.autoritzacio) {
            console.log('we are in');
            this.$router.push('/mainmenu');
          }else{
            console.log('you fucked up');
          }
          

        },
        /*login() {
          console.log('Logging in with:', this.username, this.password);
          this.$router.push('/mainmenu');
        },*/
      },
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