<template>
    <div id="app">
    <swatches-picker  v-model="this.color" :colors="palette"></swatches-picker>
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
                color:"",
                colorsConseguits: []
            };
            
        },
        methods: {
            presentarColors(){
                if(this.connexioPinia){
                    this.colorsConseguits=geColorsGacha(this.StoredUsername)
                }
            },
            cambiarColor(nouColor){
                this.store.fonsDePantalla.background=this.color
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
                store,
                connexioPinia,
                StoredUsername
            }
        }
    }
</script>
