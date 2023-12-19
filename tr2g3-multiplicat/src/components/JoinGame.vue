<template>
    <div class="container">
        <div class="centered">
            <input type="text" v-model="username" class="username-input" placeholder="Enter your username" />
            <input type="number" v-model="lobbyCode" class="lobby-input" placeholder="Enter the lobby code" />
            <button @click="joinGame" class="join-button">Join</button>
            <button @click="leaveLobby" class="leave-button">Leave</button>
        </div>
        <div class="grid">
            <div class="player" v-for="player in store.players" :key="player.name">
                <span :class="{ 'user-name': player.name === username }">{{ player.name }}</span>
                <button v-if="!player.ready" @click="markReady(player)"
                    class="ready-button ready-button-not-ready">Ready</button>
                <button v-else class="ready-button ready-button-ready" disabled>Ready</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from "../store/app";
import { socket } from "@/services/socket";
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid';

export default {
    name: "JoinGame",
    data() {
        return {
            username: "",
            lobbyCode: "",
            playerID: "",
            showCountdown: false,
            countdownSecs: 0,
        };
    },
    setup() {
        const store = useAppStore();
        const router = useRouter();

        socket.on("questions received", (questions) => {
            store.questions = questions.randomQuestions;
        });

        socket.on("start game", (data) => {
            router.push("/combat");
        });

        socket.on("player list", (players) => {
            store.players = players;
        });

        return {
            store
        }
    },
    methods: {
        joinGame() {
            if (this.username && this.lobbyCode) {
                const data = {
                    name: this.username,
                    lobby_code: this.lobbyCode,
                    playerID: uuidv4()
                };
                socket.emit("join lobby", data);
            }
        },

        leaveLobby() {
            socket.emit("leave lobby");
        },

        markReady(player) {
            player.ready = true;
            socket.emit("player ready", player);
        },
    },
    mounted() { },
};
</script>

<style scoped>
.user-name {
    color: rgb(212, 0, 255);
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.centered {
    text-align: center;
}

.username-input {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.lobby-input {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.join-button {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.leave-button {
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.ready-button {
    margin-top: 10px;
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.ready-button-not-ready {
    background-color: #dc3545;
}

.ready-button-ready {
    background-color: #28a745;
}

.ready-indicator {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
}

.join-button:hover {
    background-color: #0069d9;
}

.leave-button:hover {
    background-color: #c82333;
}

.ready-button:hover {
    background-color: #218838;
}

.join-button:active {
    background-color: #3e8e41;
}

.leave-button:active {
    background-color: #bd2130;
}

.ready-button:active {
    background-color: #1e7e34;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.player {
    border: 1px solid #ccc;
    padding: 20px;
    text-align: center;
}
</style>
