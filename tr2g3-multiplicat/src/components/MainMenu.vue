<template>
  <v-container style="margin-top: 75px;">
    <v-text-field class="code_field"></v-text-field>
    <v-btn type="submit" color="primary" style="margin-left: 700px;" @click="this.$router.push('/JoinGame')">Join Game Room</v-btn>
  </v-container>

  <v-container style="margin-top: 100px;">
    <v-row aria-rowspan="2">
      <v-col md="4">
        <v-btn class="menu_option_button" style="background-color:forestgreen;" @click="this.$router.push('/profile')">
            Perfil
        </v-btn>
        <v-btn class="menu_option_button" style="margin-top: 300px; background-color:aqua;" @click="this.$router.push('/CreateGame')">
            Entrenament
        </v-btn>
      </v-col>
      <v-col md="4">
        <v-btn class="menu_option_button" style="background-color:yellow;"  @click="snackbar = true">
          Estadistiques
        </v-btn>
        <v-btn class="menu_option_button" style="margin-top: 300px; background-color:orange;" @click="this.$router.push('/gacha')">
          Botiga
        </v-btn>
        <!--<v-btn class="menu_option_button" style="margin-top: 300px; background-color:rgb(97, 80, 175);"  @click="this.$router.push('/options')">
        Opcions
        </v-btn>-->
        <v-btn class="menu_option_button" style="margin-top: 300px; background-color:rgb(97, 80, 175);"  @click="snackbar = true">
          Opcions
        </v-btn>
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}

        <template v-slot:actions>
          <v-btn
            color="red"
            variant="text"
            @click="snackbar = false"
          >
        Ok
        </v-btn>
        </template>
      </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  
  <script>
  export default {
    data() {
      return {
      snackbar:false,
      text:'Estan en manteniment, siusplau tingues paciencia ',
      timeout:2000
    }},
    methods: {
      passwordReset() {
        
      }
    },
  };
  </script>
  
<style>
.menu_option_button{
  margin-left: 200px;
  text-align: center;
  width: 800px;
}
.code_field input{
  color: white !important;
}
</style>