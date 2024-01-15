<template>
    <v-container >
        <v-row>
            <v-col>
                <v-card flat style="height: 800px; width: 500px; margin-left: 500px; background-color: rgba(255, 255, 255, 0.5) !important; border-color: white !important;">
                    <v-img :src="this.pfp" max-height="250px"></v-img>
                    <v-card-item class="user_info_holder">
                        <v-card-title class="user_info" style="margin-left: 69px;">
                        Nom usuari: {{this.StoredUsername}}    
                        </v-card-title>
                        <v-card-text class="user_info" style="margin-top: 50px;">
                            Codi classe: {{this.classe}}  
                        </v-card-text>
                        <v-card-text class="user_info" style="margin-top: -100px;">
                            Correu: {{this.Email}}  
                        </v-card-text>
                        <v-card-text class="user_info" style="margin-top: -150px;">
                            Punts: {{this.punts}}  
                        </v-card-text>
                    </v-card-item>
                    <v-card-actions>
                        <v-btn @click="popUpPasswd=true" class="reset_password_button" style="background-color: red;">
                            Restablir contrasenya
                        </v-btn>
                        <v-card v-show="popUpPasswd" style="background-color: rgba(255, 255, 255, 0.5)">
                                <v-text-field v-model="passw" label="newPasswd"></v-text-field>
                                <v-btn @click="resetPasswd(passw)" type="submit" color="primary">Actualitzar</v-btn>
                    </v-card>
                    </v-card-actions>
                </v-card>
                
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { getUserInfo } from '@/services/CommunicationsManager';
    import { CambiarContrasenya } from '@/services/CommunicationsManager';
    import { useAppStore } from '../store/app';
    export default {
        data() {
            return {
                classe: "",
                Email: "",
                popUpPasswd:false,
                pfp:"",
                punts:""
            };
            
        },
        methods: {
            resetPasswd(passw){
                CambiarContrasenya(this.StoredUsername, passw)
            },
            obtenirInfo(){
                console.log(this.connexioPinia, " ",this.StoredUsername )
                if(this.connexioPinia){
                    getUserInfo(this.StoredUsername).then(response => {
                    this.classe = response[0].classe;
                    this.Email=response[0].correu 
                    this.pfp=response[0].fotoPerfil 
                    this.punts=response[0].puntsGacha          
                })}
            }

        },
        created() {
            this.obtenirInfo()
        },
        setup() {
            const store = useAppStore();

            let StoredUsername = store.loginInfo.username;
            let connexioPinia = store.loginInfo.loggedIn;

            return{
                connexioPinia,
                StoredUsername
            }
        }
    }
</script>

<style>
.reset_password_button{
    margin-left: 150px;
}
.user_info{
    padding: 100px;
}
.user_info_holder{
    margin-left: 100px;
}
</style>