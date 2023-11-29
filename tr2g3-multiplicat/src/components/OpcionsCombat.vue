<template>
  <v-app>
    <v-layout justify-center align-end fill-height>
      <v-card style="margin: 0; padding: 0;">
        <v-card-title>
          {{ preguntesActuals[0].pregunta }}
        </v-card-title>
        <v-row>
          <v-col cols="12">
            <v-btn class="ma-2" :disabled="answerSelected" :color="getButtonColor(respuesta)" v-for="respuesta in preguntesActuals[0].respostes" :key="respuesta" @click="selectAnswer(respuesta)">{{ respuesta.resposta }}</v-btn>
          </v-col>
        </v-row>
        <v-btn v-if="answerSelected" color="primary" @click="nextQuestion">Següent pregunta</v-btn>
      </v-card>
      <Calculadora />
    </v-layout>
  </v-app>
</template>

<script>
import { useAppStore } from '../store/app';
import { ref } from 'vue';
import Calculadora from './Calculadora.vue';

export default {
  components: {
    Calculadora,
  },
  setup() {
    const store = useAppStore();
    var preguntesActuals = store.preguntes.preguntes;
    var selectedAnswer = ref({});
    var answerSelected = ref(false);

    function selectAnswer(respuesta) {
      selectedAnswer.value = respuesta;
      answerSelected.value = true;
      if (respuesta.correcta) {
        store.reduirVidaEnemic(10);
      }
      console.log(`Has seleccionat: ${respuesta.resposta}`);
    }

    function getButtonColor(respuesta) {
      if (answerSelected.value) {
        if (selectedAnswer.value === respuesta) {
          return respuesta.correcta ? 'green' : 'red';
        } else if (respuesta.correcta) {
          return 'green';
        }
      }
      return 'primary';
    }

    function nextQuestion() {
      if (selectedAnswer.value) {
        preguntesActuals.shift();
        selectedAnswer.value = {};
        answerSelected.value = false;
      }
    }

    return {
      preguntesActuals,
      selectAnswer,
      getButtonColor,
      nextQuestion,
      selectedAnswer,
      answerSelected,
    };
  }
}
</script>
