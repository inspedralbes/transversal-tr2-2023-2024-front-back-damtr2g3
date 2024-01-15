<template>
  <v-card class="mx-auto custom-margin" max-width="300">
    <v-card-text>
      <div class="text-center">
        <h3>Enemic 1</h3>
        <v-progress-linear height="20" color="green" bg-color="red" :model-value="currentLife / maxLife * 100">
          <span>{{ currentLife }} / {{ maxLife }}</span>
        </v-progress-linear>
        <v-img :class="{ 'hit-animation': store.enemic.isHit, 'dodge-animation': store.enemic.isDodging }" :src="enemyImage" alt="Enemy Image" height="200">
        </v-img>
      </div>
    </v-card-text>
  </v-card>
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
      store,
    };
  }
}

</script>

<style scoped>
.hit-animation {
    animation: hit 1s infinite alternate;
}

@keyframes hit {
    0%, 20%, 40%, 60%, 80%, 100% { opacity: 1; }
    10%, 30%, 50%, 70%, 90% { opacity: 0; }
}

.dodge-animation {
    animation: dodge 0.7s ease-in-out;
}

@keyframes dodge {
    0% { transform: translateX(0); }
    50% { transform: translateX(-100px); }
    100% { transform: translateX(0); }
}

</style>
