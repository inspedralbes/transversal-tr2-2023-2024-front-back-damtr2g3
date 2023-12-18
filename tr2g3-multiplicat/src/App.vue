<template>
  <router-view />
</template>

<script setup>
const store = useAppStore();
  let fonsDePantalla = store.fonsDePantalla.background;
  return{
    fonsDePantalla
  }
</script>

<style>
body{
  background:fonsDePantalla;
}

</style>