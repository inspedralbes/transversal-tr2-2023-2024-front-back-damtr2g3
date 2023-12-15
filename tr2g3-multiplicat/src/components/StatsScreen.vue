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

import { obtenirStats } from './communicationsManager';
import { Bar } from 'vue-chartjs'
export default {
    name: 'GestioEstaditiques',
    data() {
        return {
            data: {},
            grafiques:[],
            chartData: {
                labels: [ data.stats.tema ],
                datasets: [ data.stats.correcte / data.stats.incorrecte  ]
            },
            chartData2: {
                labels: [ data.stats.tema ],
                datasets: [ data.stats.correcte / data.stats.incorrecte  ]
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