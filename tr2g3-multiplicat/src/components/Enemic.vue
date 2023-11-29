<template>
  <v-app>
      <v-row class="pa-0 ma-0">
        <v-col cols="12" sm="6" md="3" class="pa-0 ma-0">
          <v-card class="mx-auto custom-margin" max-width="300">
            <v-card-text>
              <div class="text-center">
                <h3>Enemic 1</h3>
                <v-progress-linear
                  height="20"
                  color="green"
                  bg-color="red"
                  :model-value="currentLife/maxLife*100"
                >
                <span>{{ currentLife }} / {{ maxLife }}</span>
              </v-progress-linear>
                <v-img
                  :src="enemyImage"
                  alt="Enemy Image"
                  height="200">
                </v-img>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  </v-app>
</template>

<script>
import { useAppStore } from '../store/app';
import { watch, ref } from 'vue';

export default {
  setup() {
    const store = useAppStore();

    let currentLife = ref(store.enemic.enemyLife);
    let maxLife = store.enemic.maxLife;
    let enemyImage = store.enemic.imatge;

    watch(() => store.enemic.enemyLife, (newValue) => {
      currentLife.value = newValue;
    });

    return {
      currentLife,
      maxLife,
      enemyImage,
    };
  }
}

</script>

<style scoped>

</style>
