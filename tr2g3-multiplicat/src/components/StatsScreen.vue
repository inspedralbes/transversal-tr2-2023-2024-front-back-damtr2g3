<template>
    <v-container>
        <v-card v-for="items, index in Stats">
            <Bar
                id="grafic1"
                :options="generarDades1(index)"
                :data="chartData"
            />
            <Bar
                id="grafic2"
                :options="generarDades2(index)"
                :data="chartData2"
            />
        </v-card>
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
        generarDades1(id){
            chartData: {
                labels: [ Stats[id].pregunta ];
                datasets: [ Stats[id].correcte - Stats[id].incorrecte  ]
            }
            return chartData
        },
        generarDades2(id){
            chartData: {
                labels: [ Stats[id].temps ];
                datasets: [ Stats[id].pregunta ]
            }
            return chartData
        }
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