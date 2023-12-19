<template>
    <v-container fluid fill-height>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card>
                    Colors:<v-select
                        :items="colorsConseguits"
                        name="colors"
                        label="Selecciona un color"
                        v-model="color"
                        v-validate="'required'"
                        item-title="idColor">
                        </v-select>
                        <v-btn @click="cambiarColor(Noucolor)" type="submit" color="primary">Cambiar color</v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { geColorsGacha } from '@/CommunicationsManager';
    import { useAppStore } from '../store/app';

    export default {

        data() {
            return {
                color:"#1CA085",
                colorsConseguits: ["#1DA055", "#2AA035"]
            };
        },
        methods: {
            presentarColors(){
                console.log("presentarColors")
                this.connexioPinia=true
                if(this.connexioPinia){
                    console.log("if")
                    geColorsGacha(this.StoredUsername).then(response=>{
                        console.log("getColorsGacga: ", response)
                        this.colorsConseguits=response
                    })
                }
            },
            cambiarColor(){
                //this.store.fonsDePantalla.background=this.color
            }

        },
        created() {
            console.log("created")
            //this.presentarColors()
        },
        setup() {
            const store = useAppStore();

            let StoredUsername = store.loginInfo.username;
            let connexioPinia = store.loginInfo.loggedIn;

            return{
                store,
                connexioPinia,
                StoredUsername
            }
        }
    }
</script>
