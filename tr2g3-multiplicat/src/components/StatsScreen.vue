<template>
    <v-container>
        <v-card v-for="grafic in grafiques">
            <v-card-title>{{ grafic.titol }}</v-card-title>
            <v-img :src="(estadistica.foto)" height="1000" width="1500" cover></v-img>
        </v-card>
    </v-container>
</template>
<script>

import { obtenirStats } from './communicationsManager';
export default {
    name: 'GestioEstaditiques',
    data() {
        return {
            data: [],
            grafiques:[]
        };
        
    },
    methods: {
        generarGrafics(){}
    },
    created() {
        obtenirStats(this.StoredUsername).then(response => {
            this.data = response            
        });

    },
        setup() {
            const store = useAppStore();
            let StoredUsername = store.loginInfo.username;
            return{
                StoredUsername
            }
        }

}
</script>