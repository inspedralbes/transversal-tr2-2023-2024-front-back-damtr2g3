<template>
    <div>
        <h1>Ranking</h1>
        <div v-for="player in playerRankings" :key="player.id">
            {{ player.name }}:{{ player.score }}
        </div>
    </div>
</template>

<script>
import { useAppStore } from '../store/app';
import { ref, watchEffect } from 'vue';
import { socket } from '@/services/socket';

export default {
    name: 'FinishScreen',
    components: {
    },
    setup() {
        const store = useAppStore();
        let playerRankings = ref([]);

        socket.on("finish ranking", (players) => {
            store.players = players;
            playerRankings.value = store.players;
        });

        return {
            playerRankings
        };
    },
};
</script>

<style scoped></style>
