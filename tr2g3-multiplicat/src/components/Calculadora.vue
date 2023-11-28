<template>
    <div class="calculator">
      <input v-model="expression" type="text" placeholder="Enter expression">
      <button @click="calculate">Calculate</button>
      <p>Result: {{ result }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        expression: '',
        result: 0
      }
    },
    methods: {
      calculate() {
        try {
          this.result = eval(this.expression);
        } catch (error) {
          alert("Invalid expression");
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .calculator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  </style>
  