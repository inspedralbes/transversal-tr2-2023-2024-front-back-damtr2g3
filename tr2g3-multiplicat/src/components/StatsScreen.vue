<script>
import { obtenirStats } from '@/services/CommunicationsManager';
import { useAppStore } from '../store/app';
import { Bar } from 'vue-chartjs'

export default {
  data() {
    return {
      Stats: [],
      chartData: null,
      chartData2: null,
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
      this.Stats = response;
      this.chartData = {
        labels: this.Stats.map(stat => stat.pregunta),
        datasets: [{
          label: 'Correct - Incorrect',
          data: this.Stats.map(stat => stat.correcte - stat.incorrecte)
        }]
      };
      this.chartData2 = {
        labels: this.Stats.map(stat => stat.temps),
        datasets: [{
          label: 'Pregunta',
          data: this.Stats.map(stat => stat.pregunta)
        }]
      };
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
