<template>
    <div class="pokeball" @click="toggleOpen">
      <div class="pokeball-button"></div>
      <div class="pokeball-top" :class="{ 'pokeball-open': isOpen }"></div>
      <div class="pokeball-bottom" :class="{ 'pokeball-open': isOpen }"></div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      toggleOpen() {
        this.isOpen = !this.isOpen;
      },
    },
  };
  </script>
  
  <style scoped>
  .pokeball {
    position: relative;
    width: 100px;
    height: 100px;
    background: #fff;
    border: 10px solid #000;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
  }
  
  .pokeball-button {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    background: #7f8c8d;
    border: 2px solid #000;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  
  .pokeball-top,
  .pokeball-bottom {
    position: absolute;
    width: 100%;
    height: 50%;
    background: #e74c3c;
    transition: all 0.5s ease;
  }
  
  .pokeball-top {
    top: 0;
  }
  
  .pokeball-bottom {
    bottom: 0;
    background: #fff;
  }
  
  .pokeball-open {
    height: 0;
  }
  </style>
  