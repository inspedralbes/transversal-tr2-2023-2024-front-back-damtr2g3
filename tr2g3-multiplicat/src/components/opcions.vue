<template>
    <div id="app">
    <swatches-picker v-model="color" :colors="palette"></swatches-picker>
    <div class="preview" :style="{ backgroundColor: color }"></div>
  </div>
</template>

<script>
    import { geColorsGacha } from '@/CommunicationsManager';
    import { useAppStore } from '../store/app';
    import { Swatches } from 'vue-color'

    export default {
        components: {
            'swatches-picker': Swatches
        },
        data() {
            return {
                colorInicial: '#194d33',
                colorsConseguits: []
            };
            
        },
        methods: {
            presentarColors(){
                if(this.connexioPinia){
                    this.colorsConseguits=geColorsGacha(this.StoredUsername)
                }
            }

        },
        created() {
            this.presentarColors()
        },
        setup() {
            const store = useAppStore();

            let StoredUsername = store.loginInfo.username;
            let connexioPinia = store.loginInfo.loggedIn;

            return{
                connexioPinia,
                StoredUsername
            }
        }
    }
</script>
