<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <!-- Your login form goes here -->
        <v-card
          style="background-color: rgba(255, 255, 255, 0.5) !important; border-color: white !important; margin-top: 300px;">
          <v-card-title class="headline">
            Login
          </v-card-title>
          <v-card-text>
            <!-- Your login form inputs go here -->
            <v-form>
              <v-text-field v-model="username" label="Username"></v-text-field>
              <v-text-field v-model="contrasenya" label="contrasenya" type="password"></v-text-field>
            </v-form>
            <v-snackbar v-model="snackbar" :timeout="timeout">
              {{ text }}

              <template v-slot:actions>
                <v-btn color="red" variant="text" @click="snackbar = false">
                  Ok
                </v-btn>
              </template>
            </v-snackbar>
            <v-btn @click="validateLoginBtn(username, contrasenya)" type="submit" color="primary"
              class="mr-4">Login</v-btn>
            <v-btn @click=prepararRegistre() type="submit" color="primary">Registrat</v-btn>
            <v-card v-show="popUpRegistre"
              style="background-color: rgba(255, 255, 255, 0.5) !important; border-color: white !important;">
              Nom:<v-text-field v-model="nom" label="nom"></v-text-field>
              Username:<v-text-field v-model="user" label="user"></v-text-field>
              Contrasenya:<v-text-field v-model="contrasenya" label="contrasenya"></v-text-field>
              link Foto de perfil:<v-text-field v-model="foto" label="foto"></v-text-field>
              Correu:<v-text-field v-model="email" label="email"></v-text-field>
              Classe:<v-select :items="classes" name="classes" label="Selecciona una classe" v-model="classe"
                v-validate="'required'" item-title="idClasse">
              </v-select>
              <v-btn @click="crearUser(nom, user, contrasenya, foto, email, classe)" type="submit" color="primary">Crear
                l'usuari</v-btn>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
    
    
<script>
import { validateLogin } from '@/services/CommunicationsManager';
import { nouUsuari } from '@/services/CommunicationsManager';
import { useAppStore } from '../store/app';
import { revisarClasses } from '@/services/CommunicationsManager';
export default {
  data() {
    return {
      username: '',
      password: '',
      popUpRegistre: false,
      nom: "",
      user: "",
      contrasenya: "",
      foto: "",
      email: "",
      classe: "",
      classes: [],
      text: "S'ha rebutjat la teva solicitud, revisa que les credencials siguin correctes i que el teu professor hagi acceptat el teu usuari",
      snackbar: false,
      timeout: 4000
    };
  },
  methods: {
    GuardarLogin(username, id) {
      this.store.loginInfo.loggedIn = true
      this.store.loginInfo.username = username
      this.store.loginInfo.id = id
    },
    prepararRegistre() {
      if (this.popUpRegistre)
        this.popUpRegistre = false
      else
        this.popUpRegistre = true
    },
    async validateLoginBtn(username, password) {
      console.log("hola")
      var autoritzacio = await validateLogin(username, password);
      console.log(autoritzacio);
      if (autoritzacio.autoritzacio) {
        this.GuardarLogin(username, autoritzacio.idUsuari)
        console.log('correcte');
        this.$router.push('/mainmenu');
      } else {
        this.snackbar = true
        console.log('error');
      }
    },
    crearUser(nom, user, contrasenya, foto, email, classe) {
      nouUsuari(nom, user, contrasenya, foto, email, classe)
      this.popUpRegistre = false
    },
  },
  setup() {
    const store = useAppStore();
    store
    return {
      store
    }
  },
  created() {
    revisarClasses().then(response => {
      this.classes = response
    })

  }
};
</script>
    
<style>
.fill-height {
  height: 100vh;
  /* 100% of the viewport height */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>