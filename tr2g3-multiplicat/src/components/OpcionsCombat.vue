<template>
  <v-row>
    <v-col>
      <v-card style="margin: 0; padding: 0;">
        <v-card-title>
          {{ preguntesActuals[currentQuestionIndex].pregunta }}
        </v-card-title>
        <v-row>
          <v-col cols="6" v-for="respuesta in preguntesActuals[currentQuestionIndex].respostes" :key="respuesta">
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

<style scoped></style>

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

    watchEffect(() => {
      preguntesActuals.value = store.questions;
    });

    function selectAnswer(respuesta) {
      selectedAnswer.value = respuesta;
      answerSelected.value = true;
      if (respuesta.correcta) {
        store.reduirVidaEnemic(10);
      }

      socket.emit('question answered', respuesta);
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

    return {
      preguntesActuals,
      selectAnswer,
      getButtonColor,
      nextQuestion,
      selectedAnswer,
      answerSelected,
      currentQuestionIndex
    };
  }
}
</script>
