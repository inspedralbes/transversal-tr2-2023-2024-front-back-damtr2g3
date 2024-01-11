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
                labels: [ this.Stats.pregunta ],
                datasets: [ this.Stats.correcte - this.Stats.incorrecte  ]
            },
            chartData2: {
                labels: [this.Stats.temps ],
                datasets: [ this.Stats.pregunta  ]
            },
            chartOptions: {
                responsive: true
            }
        };
        
    },
    methods: {
        generarDades1(id){
            chartData: {
                labels: [ this.Stats[id].pregunta ];
                datasets: [ this.Stats[id].correcte - this.Stats[id].incorrecte  ]
            }
            return chartData
        },
        generarDades2(id){
            chartData: {
                labels: [ this.Stats[id].temps ];
                datasets: [ this.Stats[id].pregunta ]
            }
            return chartData
        }
    },
    created() {
        console.log("on created")
        obtenirStats(this.StoredUsername).then(response => {
            this.Stats = response  
            console.log(Stats)          
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
