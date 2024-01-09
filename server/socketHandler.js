// Desc: Socket handler for the server
const lobbies_mongo = require('./partides_mongo.js');

async function handleGetLobbies(socket){
    socket.on("get lobbies", () => {
        sendLobbyList();
    });
}

async function handleGetPlayers(socket) {
    return new Promise((resolve, reject) => {
      socket.on('get players', async (data) => {
        try {
          const jugadors = await lobbies_mongo.getPlayersByLobbyCode(data);
          if (jugadors != null) {
            resolve({ type: 'players list', data: JSON.stringify(jugadors) });
          } else {
            resolve({ type: 'players error' });
          }
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    });
  }  
  

async function handleNewLobby(socket){
    socket.on("newLobby", async (data) => {
        try{
            const lobby_exists = await lobbies_mongo.lobbyExists(data.lobby_code);
            if(!lobby_exists){
                let questions = await getQuestionsBySubject(data.subject);
                let lobby = {
                    lobby_code: data.lobby_code,
                    subject: data.subject,
                    questions: questions,
                    date: new Date().getTime(),
                    players: [],
                    maxPlayers: data.max_players,
                };
                await lobbies_mongo.insertLobby(lobby);
            } else {
                io.to(socket.id).emit("Lobby exists", data);
            }
        } catch (error){
            console.log(error);
        }
    });
}

async function handleJoinLobby(socket) {
    socket.on("join lobby", async (data) => {
        try {
            console.log("joining lobby");

            const isLobby = await lobbies_mongo.isThereAnyLobby();
            if (!isLobby) {
                throw new Error("No lobbies found");
            }

            const doesLobbyExist = await lobbies_mongo.lobbyExists(data.lobby_code);
            if (!doesLobbyExist) {
                throw new Error("Lobby not found");
            }

            const [isFull, isNameAvailable] = await Promise.all([
                lobbies_mongo.isLobbyFull(data.lobby_code),
                lobbies_mongo.isPlayerNameAvailable(data.lobby_code, data.name)
            ]);

            if (isFull) {
                throw new Error("Lobby is full");
            }

            if (!isNameAvailable) {
                throw new Error("Name not available");
            }

            let player = {
                lobby_code: data.lobby_code,
                name: data.name,
                score: 0,
                status: "connected",
                ready: false,
            }

            await lobbies_mongo.addPlayerToLobby(data.lobby_code, player);
            socket.join(data.lobby_code);
            io.emit("player join", player);
            socket.data.current_lobby = data.lobby_code;
            socket.data.name = data.name;
            sendLobbyList();
            sendPlayerList(socket);
            sendQuestions(socket);

        } catch (error) {
            console.error(error);
            io.to(socket.id).emit("connection error", {
                errorMsg: error.message,
            });
        }
    });
}

async function handlePlayerReady(socket) {
    socket.on("player ready", async (player) => {
        try {
            await lobbies_mongo.playerReady(player.lobby_code, player.name);
            let data = {
                lobbyId: player.lobby_code,
                playerName: player.name,
            }
            io.emit("status ready", data);
            const result = await lobbies_mongo.checkAllReady(player.lobby_code);
            if (result) {
                sendPlayerList(socket);
                let dataReady = {
                    lobbyId: player.lobby_code,
                }
                io.emit("all ready", dataReady);
                await lobbies_mongo.setAllPlaying(player.lobby_code);
                sendPlayerList(socket);
                io.to(socket.data.current_lobby).emit("start game");
                io.to(socket.data.lobby_code).emit("start countdown");
                setTimeout(() => {
                    io.to(socket.data.lobby_code).emit("start game");
                }, 5000);
            } else {
                sendPlayerList(socket);
            }
        } catch (error) {
            console.error(error);
        }
    });
}


async function handleEndGame(socket) {
    socket.on("end game", async (data) => {
        try {
            await lobbies_mongo.deleteLobby(data);
            sendLobbyList();
        } catch (error) {
            console.error(error);
        }
    });
}


async function handleRemovePlayer(socket) {
    socket.on("remove player", async (data) => {
        try {
            await lobbies_mongo.leaveLobby(data.lobby_code, data.name);
            sendPlayerList(socket);
            sendLobbyList();
            let info = {
                name: data.name,
                lobby: data.lobby_code,
            }
            io.emit("player leave", info);
        } catch (error) {
            console.error(error);
        }
    });
}


async function handleLeaveLobby(socket) {
    socket.on("leave lobby", async () => {
        try {
            await lobbies_mongo.leaveLobby(socket.data.current_lobby, socket.data.name);
            socket.leave(socket.data.current_lobby);
            sendPlayerList(socket);
            sendLobbyList();
            let info = {
                name: socket.data.name,
                lobby: socket.data.current_lobby,
            }
            io.emit("player leave", info);
        } catch (error) {
            console.error(error);
        }
    });
}


async function handleQuestionAnswered(socket) {
    socket.on("question answered", async (data) => {
        try {
            if(data.correcta){
                let increaseData = {
                    lobbyId: socket.data.current_lobby,
                    playerName: socket.data.name,
                    incrementAmount: 10
                }
                io.emit("increment score", increaseData);
                await lobbies_mongo.increaseScore(socket.data.current_lobby, socket.data.name, 10);
                sendPlayerList(socket);
            }
        } catch (error) {
            console.error(error);
        }
    });
}


async function handleAnswerData(socket) {
    socket.on("answer data", async (data) => {
        try {
            await stats_mongo.insertStats(data);
            console.log("Stats inserted");
        } catch (error) {
            console.error(error);
        }
    });
}


async function handleQuestionsEnded(socket) {
    socket.on("questions ended", async (data) => {
        try {
            await lobbies_mongo.playerFinished(socket.data.current_lobby, socket.data.name);
            let info = {
                playerName: socket.data.name,
                lobbyId: socket.data.current_lobby,
            }
            io.emit("player finished", info);
            const result = await lobbies_mongo.checkAllFinished(socket.data.current_lobby);
            if (result) {
                io.to(socket.data.current_lobby).emit("end game");
                await lobbies_mongo.deleteLobby(socket.data.current_lobby);
                sendLobbyList();
                console.log("Game ended");
            }
        } catch (error) {
            console.error(error);
        }
    });
}


async function handleDisconnect(socket) {
    socket.on("disconnect", async () => {
        try {
            await lobbies_mongo.leaveLobby(socket.data.current_lobby, socket.data.name);
            socket.leave(socket.data.current_lobby);
            sendPlayerList(socket);
            sendLobbyList();
            let info = {
                name: socket.data.name,
                lobby: socket.data.current_lobby,
            }
            io.emit("player leave", info);
        } catch (error) {
            console.error(error);
        }
    });
}

async function sendLobbyList() {
    const lobbies = await lobbies_mongo.getLobbies();
    io.emit("lobbies list", JSON.stringify(lobbies));
  }

async function sendQuestions(socket) {
    const currentLobby = await lobbies_mongo.findLobby(socket.data.current_lobby);
    if (currentLobby) {
        io.to(socket.data.current_lobby).emit(
            "questions received",
            currentLobby.questions
        );
    }
}

module.exports = {handleGetLobbies, handleGetPlayers, handleNewLobby, handleJoinLobby, handlePlayerReady, handleEndGame, handleRemovePlayer, 
    handleLeaveLobby, handleQuestionAnswered, handleAnswerData, handleQuestionsEnded, handleDisconnect, sendLobbyList, sendQuestions};