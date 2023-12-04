<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="10">
            <v-text-field
              label="Resultat"
              v-model="result"
              outlined
              readonly
              class="display-1"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" v-for="number in numbers" :key="number">
            <v-btn block outlined color="primary" @click="appendNumber(number)">{{ number }}</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" v-for="operator in operators" :key="operator">
            <v-btn block outlined color="secondary" @click="setOperator(operator)">{{ operator }}</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-btn block outlined color="success" @click="calculate">=</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block outlined color="error" @click="clear">C</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    firstNumber: '',
    secondNumber: '',
    operator: null,
    result: '',
    numbers: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0],
    operators: ['+', '-', '*', '/'],
  }),
  methods: {
    appendNumber(number) {
      if (this.operator === null) {
        this.firstNumber += number.toString();
        this.result = Number(this.firstNumber).toString();
      } else {
        this.secondNumber += number.toString();
        this.result = Number(this.secondNumber).toString();
      }
    },
    setOperator(operator) {
      this.operator = operator;
    },
    calculate() {
      if (this.operator !== null && this.firstNumber !== '' && this.secondNumber !== '') {
        this.result = eval(Number(this.firstNumber) + this.operator + Number(this.secondNumber));
        this.firstNumber = this.result;
        this.secondNumber = '';
        this.operator = null;
      }
    },
    clear() {
      this.firstNumber = '';
      this.secondNumber = '';
      this.operator = null;
      this.result = '';
    },
  },
};
</script>
