<template>
  <v-row>
    <v-col>
      <v-card style="margin: 0; padding: 0;">
        <v-card-title>
          {{ preguntesActuals[currentQuestionIndex].pregunta }}
        </v-card-title>
        <v-row>
          <v-col cols="6" v-for="respuesta in shuffledAnswers" :key="respuesta">
            <v-btn class="ma-1" :disabled="answerSelected" :color="getButtonColor(respuesta)"
              @click="selectAnswer(respuesta)" style="width: 170px; height: 50px;">{{ respuesta.resposta }}</v-btn>
          </v-col>
        </v-row>
        <v-btn v-if="answerSelected" color="primary" @click="nextQuestion">Següent pregunta</v-btn>
      </v-card>
    </v-col>
    <v-col>
      <Calculadora />
    </v-col>
  </v-row>
</template>

<script>
import { useAppStore } from '../store/app';
import { ref, watchEffect } from 'vue';
import Calculadora from './Calculadora.vue';
import { socket } from '@/services/socket';
import router from '@/router';

export default {
  components: {
    Calculadora,
  },
  setup() {
    const store = useAppStore();
    const preguntesActuals = ref([]);
    const selectedAnswer = ref({});
    const answerSelected = ref(false);
    let currentQuestionIndex = ref(0);
    let startTime = ref(null);

    watchEffect(() => {
      preguntesActuals.value = store.questions;
      startTime.value = Date.now();
    });

    function selectAnswer(respuesta) {
      let answerTimeInMS = Date.now() - startTime.value;
      let answerTime = (answerTimeInMS / 1000).toFixed(2); // Redondea a 2 decimales
      startTime.value = Date.now();

      selectedAnswer.value = respuesta;
      answerSelected.value = true;

      store.attack();
      if (respuesta.correcta) {
        store.reduirVidaEnemic(10);
        store.getHit();
      } else {
        store.dodge();
      }

      let answerData = {
        playerId: store.loginInfo.id,
        questionId: preguntesActuals.value[currentQuestionIndex.value].id,
        question: preguntesActuals.value[currentQuestionIndex.value].pregunta,
        resultat: respuesta.correcta,
        answerTime: answerTime
      };

      console.log(respuesta);
      socket.emit('question answered', respuesta);
      socket.emit('answer data', answerData);
    }

    function getButtonColor(respuesta) {
      if (answerSelected.value) {
        if (selectedAnswer.value === respuesta) {
          return respuesta.correcta ? 'green' : 'red';
        } else if (respuesta.correcta) {
          return 'green';
        }
      }
      return {};
    }

    function nextQuestion() {
      if (selectedAnswer.value) {
        selectedAnswer.value = {};
        answerSelected.value = false;
      }

      if (currentQuestionIndex.value >= preguntesActuals.value.length - 1) {
        router.push("/FinishScreen")
        socket.emit("questions ended")
      } else {
        currentQuestionIndex.value++;
      }
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }

      return array;
    }

    const shuffledAnswers = computed(() => {
      return shuffleArray(preguntesActuals.value[currentQuestionIndex.value].respostes);
    });

    return {
      preguntesActuals,
      selectAnswer,
      getButtonColor,
      nextQuestion,
      selectedAnswer,
      answerSelected,
      currentQuestionIndex,
      shuffleArray,
      shuffledAnswers
    };
  },
}
</script>