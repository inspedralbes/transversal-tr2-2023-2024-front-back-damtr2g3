<template>
    <div class="container">
        <div class="form">
            <h2>Create Game Lobby</h2>
            <div class="form-group">
                <label for="subject">Subject:</label>
                <input type="text" id="subject" v-model="subject" />
            </div>
            <div class="form-group">
                <label for="max_players">Max Players:</label>
                <input type="number" id="max_players" v-model="max_players" />
            </div>
            <button @click="generateRandomInt">Generate</button>
            <div v-if="randomInt">
                <button @click="newGameLobby">Open Game Lobby</button>
            </div>
            <div v-if="lobbyCode">
                <p>Lobby Code: {{ lobbyCode }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from "../store/app";
import { socket } from "@/services/socket";

export default {
    name: "CreateGame",
    data() {
        return {
            subject: "",
            max_players: null,
            randomInt: null,
            lobbyCode: null,
        };
    },
    setup() {
        const store = useAppStore();

        return {
            store,
        };
    },
    methods: {
        newGameLobby() {
            if (this.subject && this.max_players && this.randomInt) {
                const gameData = {
                    lobby_code: this.randomInt,
                    subject: this.subject,
                    max_players: this.max_players,
                };
                socket.emit("newLobby", gameData);
                this.lobbyCode = this.randomInt;
            }
        },

        generateRandomInt() {
            const randomInt = Math.floor(Math.random() * 90000) + 10000;
            this.randomInt = randomInt;
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.form {
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form h2 {
    text-align: center;
}

.form-group {
    margin-bottom: 10px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

button:hover {
    background-color: #0069d9;
}
</style>
