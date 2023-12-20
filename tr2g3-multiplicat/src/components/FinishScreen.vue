<template>
    <div class="podium">
        <h1>Ranking</h1>
        <div class="podium-container">
            <div v-for="(player, index) in players" :key="player.id" class="podium-item"
                :class="{ 'first-place': index === 0, 'second-place': index === 1, 'third-place': index === 2 }">
                <div class="position">{{ index + 1 }}</div>
                <div class="player-info">
                    <span class="name">{{ player.name }}</span>
                    <span class="score">{{ player.score }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '../store/app';
import { ref, watchEffect } from 'vue';
import { socket } from '@/services/socket';

export default {
    name: 'FinishScreen',
    components: {},
    setup() {
        const store = useAppStore();
        const players = ref([]);

        watchEffect(() => {
            players.value = store.players.sort((a, b) => b.score - a.score);;
        });

        return {
            players,
        };
    },
};
</script>

<style scoped>
.podium {
    text-align: center;
}

.podium-container {
    display: flex;
    justify-content: space-around;
}

.podium-item {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    margin: 10px;
    flex: 1;
    position: relative;
}

.first-place {
    background-color: gold;
}

.second-place {
    background-color: silver;
}

.third-place {
    background-color: #cd7f32;
    /* bronze */
}

.position {
    font-size: 24px;
    font-weight: bold;
}

.player-info {
    margin-top: 10px;
}

.name {
    font-weight: bold;
}

.score {
    color: #666;
}
</style>