<template>
    <div class="container">
        <div class="centered">
            <input type="text" v-model="username" class="username-input" placeholder="Enter your username" />
            <input type="number" v-model="lobbyCode" class="lobby-input" placeholder="Enter the lobby code" />
            <button @click="pasteFromClipboard" class="join-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                </svg>
            </button>
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

        async pasteFromClipboard() {
            if (!navigator.clipboard) {
                console.error('the browser does not support the clipboard API');
                return;
            }
            try {
                const text = await navigator.clipboard.readText();
                this.lobbyCode = text;
            } catch (err) {
                console.error('error reading from clipboard', err);
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
