<template>
    <v-container>
        <Bar
        id="grafic1"
        :options="chartOptions"
        :data="chartData"
        />
        <Bar
        id="grafic2"
        :options="chartOptions"
        :data="chartData2"
        />
    </v-container>
</template>
<script>

import { obtenirStats } from '@/services/CommunicationsManager';
import { useAppStore } from '../store/app';
import { Bar } from 'vue-chartjs'
export default {
    //name: 'GestioEstaditiques',
    data() {
        return {
            Stats: [{}],
            grafiques:[],
            chartData: {
                labels: [ Stats.pregunta ],
                datasets: [ Stats.correcte - Stats.incorrecte  ]
            },
            chartData2: {
                labels: [Stats.temps ],
                datasets: [ Stats.pregunta  ]
            },
            chartOptions: {
                responsive: true
            }
        };
        
    },
    methods: {
        generarGrafics(){}
    },
    created() {
        console.log("on created")
        obtenirStats(this.StoredUsername).then(response => {
            this.Stats = response            
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