<template>
  <router-view />
</template>

<script >
  import { useAppStore } from './store/app';
    export default {
      data(){
        return{
          myStyle:{
              backgroundColor:"#00FFFF"
              }
      }},
      
      setup() {
            const store = useAppStore()
            let back = store.fonsDePantalla
            return{
                back
            }
        }
    }
</script>

<style>
body{
  background-color:#00FFFF;
}
</style>