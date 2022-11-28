"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUpdateService = void 0;
const common_1 = require("@nestjs/common");
const Game_1 = require("./elements/Game");
const GameSelection_1 = require("./elements/GameSelection");
const game_service_1 = require("./game.service");
const game_socket_helper_1 = require("./game.socket.helper");
let GameUpdateService = class GameUpdateService {
    constructor(gameService, socketHelper) {
        this.gameService = gameService;
        this.socketHelper = socketHelper;
        this.updateInterval = undefined;
        this.games = new Map();
        this.gameSelections = new Map;
    }
    initServer(socketServer) {
        this.server = socketServer;
    }
    getGameSelection(roomId) {
        const gameSelection = this.gameSelections.get(roomId);
        return (gameSelection);
    }
    getGame(roomId) {
        const game = this.games.get(roomId);
        if (!game
            || game.state != Game_1.GameState.Running)
            return (undefined);
        return (game);
    }
    getGameSelectionData(roomId) {
        const gameSelection = this.getGameSelection(roomId);
        if (gameSelection)
            return (gameSelection.data);
        return (undefined);
    }
    getGameClientStartData(roomId) {
        const game = this.getGame(roomId);
        if (game)
            return (game.clientStartData());
        return (undefined);
    }
    attemptGameInit(roomId) {
        if (!this.gameSelections.get(roomId)
            && !this.games.get(roomId))
            this.startGame(roomId);
    }
    selectionInput(roomId, player, input) {
        const gameSelection = this.getGameSelection(roomId);
        if (!gameSelection)
            return (undefined);
        if (input === 0)
            gameSelection.nextLeft(player);
        else if (input === 1)
            gameSelection.nextRight(player);
        else
            gameSelection.confirm(player);
        return (gameSelection.data);
    }
    attemptSelectionFinish(roomId) {
        const gameSelection = this.getGameSelection(roomId);
        if (gameSelection.finished) {
            this.startMatch(roomId, gameSelection.data);
            this.gameSelections.delete(roomId);
        }
    }
    paddleInput(roomId, player, move) {
        const game = this.getGame(roomId);
        if (!game)
            return;
        if (player === "PlayerA")
            game.addPaddleAMove(move);
        else
            game.addPaddleBMove(move);
    }
    heroInput(roomId, player, move) {
        const game = this.getGame(roomId);
        if (!game)
            return;
        if (player === "PlayerA")
            game.addHeroAInvocation(move);
        else
            game.addHeroBInvocation(move);
    }
    gameTransition(gameId) {
        setTimeout(() => {
            this.gameSelections.delete(gameId);
            this.games.delete(gameId);
            this.manageUpdateInterval();
            this.startGame(gameId);
        }, 10000);
    }
    gameEnd(gameId, gameResult) {
        this.socketHelper.emitToRoom(this.server, gameId, "end", {
            winner: gameResult.winnerNick
        });
        this.gameService.endGame(gameId, gameResult);
        this.socketHelper.clearRoom(this.server, `${gameId}-PlayerA`);
        this.socketHelper.clearRoom(this.server, `${gameId}-PlayerB`);
        this.gameTransition(gameId);
    }
    pointTransition(game, gameId) {
        setTimeout(() => {
            game.serveBall();
            this.socketHelper.emitToRoom(this.server, gameId, "served");
        }, 3000);
    }
    gameUpdate(game, room) {
        if (game.update()) {
            if (game.isFinished()) {
                this.gameEnd(room, game.getResult());
                return;
            }
            else
                this.pointTransition(game, room);
        }
        this.server.to(room).emit('matchUpdate', game.data());
    }
    manageUpdateInterval() {
        if (this.updateInterval === undefined
            && this.games.size === 1) {
            this.updateInterval = setInterval(() => {
                this.games.forEach((gameElem, room) => {
                    if (gameElem.state === Game_1.GameState.Running)
                        this.gameUpdate(gameElem, room);
                });
            }, 16);
        }
        else if (this.updateInterval
            && this.games.size === 0) {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined;
        }
    }
    sendSelectionData(role, selectionData, roomId) {
        this.socketHelper.emitToRoom(this.server, roomId, "newGame", {
            role: role,
            selection: selectionData
        });
    }
    async startGame(gameId) {
        let gameSelection;
        let selectionData;
        let playerRoom;
        let players = this.gameService.startGame(gameId);
        if (!players[0] || !players[1])
            return;
        if (this.gameSelections.get(gameId) != undefined)
            this.gameSelections.delete(gameId);
        gameSelection = this.gameSelections.set(gameId, new GameSelection_1.GameSelection(players[0].username, players[1].username)).get(gameId);
        selectionData = gameSelection.data;
        playerRoom = `${gameId}-PlayerA`;
        await this.socketHelper.addUserToRoom(this.server, players[0].username, playerRoom);
        this.sendSelectionData("PlayerA", selectionData, playerRoom);
        playerRoom = `${gameId}-PlayerB`;
        await this.socketHelper.addUserToRoom(this.server, players[1].username, playerRoom);
        this.sendSelectionData("PlayerB", selectionData, playerRoom);
        this.sendSelectionData("Spectator", selectionData, gameId);
    }
    startMatch(gameId, gameSelectionData) {
        let game;
        if (this.games.get(gameId) != undefined)
            this.games.delete(gameId);
        game = this.games.set(gameId, new Game_1.Game(gameSelectionData)).get(gameId);
        this.socketHelper.emitToRoom(this.server, gameId, "startMatch", game.clientStartData());
        this.pointTransition(game, gameId);
        this.manageUpdateInterval();
    }
    playerWithdrawal(roomId, playerRoomId) {
        const gameSelection = this.getGameSelection(roomId);
        const game = this.getGame(roomId);
        const winner = playerRoomId[playerRoomId.length - 1] === 'A'
            ? 1 : 0;
        if ((!gameSelection && !game)
            || (game && game.state != Game_1.GameState.Running))
            return;
        if (game) {
            game.state = Game_1.GameState.Finished;
            game.forceWin(winner);
            this.gameEnd(roomId, game.getResult());
            return;
        }
        gameSelection.status = GameSelection_1.SelectionStatus.Canceled;
        this.gameEnd(roomId, {
            winnerNick: winner === 0 ? gameSelection.data.nickPlayerA
                : gameSelection.data.nickPlayerB,
            loserNick: winner != 0 ? gameSelection.data.nickPlayerA
                : gameSelection.data.nickPlayerB,
            winnerScore: Game_1.Game.getWinScore(),
            loserScore: 0,
        });
    }
};
GameUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_service_1.GameService,
        game_socket_helper_1.SocketHelper])
], GameUpdateService);
exports.GameUpdateService = GameUpdateService;
//# sourceMappingURL=game.updateService.js.map