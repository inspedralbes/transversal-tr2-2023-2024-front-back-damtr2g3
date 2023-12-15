<template>
    <div>
        <h1>Ranking</h1>
        <ol>
            <li v-for="(player, index) in players" :key="player.id">
                {{ index + 1 }}. {{ player.name }} - {{ player.score }}
            </li>
        </ol>
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

<style scoped></style>
