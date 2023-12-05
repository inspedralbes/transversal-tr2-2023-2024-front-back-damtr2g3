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
                {{ player.name }}
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from "../store/app";
import { socket } from "@/services/socket";
import { ref } from 'vue';

export default {
    name: "JoinGame",
    data() {
        return {
            username: "",
            lobbyCode: "",
        };
    },
    setup() {
        const store = useAppStore();

        socket.on("start game", (data) => {
            this.$router.push("/");
        });

        socket.on("player list", (players) => {
            console.log(players);
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
                    lobby_code: this.lobbyCode
                };
                socket.emit("join lobby", data);
            }
        },
        leaveLobby() {
            socket.emit("leave lobby");
        },
    },
    mounted() { },
};
</script>

<style scoped>
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

.join-button:hover {
    background-color: #0069d9;
}

.leave-button:hover {
    background-color: #c82333;
}

.join-button:active {
    background-color: #3e8e41;
}

.leave-button:active {
    background-color: #bd2130;
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
