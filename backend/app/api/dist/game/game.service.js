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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const loser_entity_1 = require("../match/loser/loser.entity");
const match_dto_1 = require("../match/match.dto");
const match_service_1 = require("../match/match.service");
const winner_entity_1 = require("../match/winner/winner.entity");
const user_entity_1 = require("../user/user.entity");
const user_service_1 = require("../user/user.service");
const game_queueService_1 = require("./game.queueService");
const game_rankingService_1 = require("./game.rankingService");
let GameService = class GameService {
    constructor(userService, rankingService, queueService, matchService) {
        this.userService = userService;
        this.rankingService = rankingService;
        this.queueService = queueService;
        this.matchService = matchService;
        this.gamePlayers = new Map;
    }
    startGame(gameId) {
        let nextPlayers = this.queueService.getNextPlayers(gameId);
        let currentPlayers;
        if (nextPlayers[0] === undefined)
            return (nextPlayers);
        currentPlayers = this.gamePlayers.get(gameId);
        if (currentPlayers === undefined) {
            currentPlayers = this.gamePlayers.set(gameId, [undefined, undefined]).get(gameId);
        }
        currentPlayers[0] = nextPlayers[0];
        currentPlayers[1] = nextPlayers[1];
        this.queueService.remove(gameId, nextPlayers[0].username);
        this.queueService.remove(gameId, nextPlayers[1].username);
        return (nextPlayers);
    }
    isOfficial(gameId) {
        return (true);
    }
    async saveRankings(playerA, playerB) {
        let resultA;
        let resultB;
        try {
            resultA = this.userService.updateUser(playerA.username, {
                ranking: playerA.ranking,
                category: playerA.category
            });
            resultB = this.userService.updateUser(playerB.username, {
                ranking: playerB.ranking,
                category: playerB.category
            });
            await resultA;
            await resultB;
        }
        catch (err) {
            console.error(err);
            return (false);
        }
        return (true);
    }
    async updateCategory(username, ranking, category) {
        const minMatches = 3;
        if (category === user_entity_1.Category.Pending) {
            if (await this.matchService.countUserMatches(username) < minMatches)
                return (category);
        }
        return (this.rankingService.getCategory(ranking));
    }
    async updatePlayerRankings(players, winner) {
        [players[0].ranking, players[1].ranking] =
            this.rankingService.updateRanking({ ranking: players[0].ranking, category: players[0].category }, { ranking: players[1].ranking, category: players[1].category }, winner);
        players[0].category = await this.updateCategory(players[0].username, players[0].ranking, players[0].category);
        players[1].category = await this.updateCategory(players[1].username, players[1].ranking, players[1].category);
        return (await this.saveRankings(players[0], players[1]));
    }
    createPlayerEntities(players, gameResult) {
        let winnerEntity = new winner_entity_1.WinnerEntity;
        let loserEntity = new loser_entity_1.LoserEntity;
        const winnerNick = gameResult.winnerNick;
        winnerEntity.user = players[0].nickName === winnerNick
            ? players[0] : players[1];
        winnerEntity.score = gameResult.winnerScore;
        loserEntity.user = players[0].nickName != winnerNick
            ? players[0] : players[1];
        loserEntity.score = gameResult.loserScore;
        return ([winnerEntity, loserEntity]);
    }
    async saveMatch(players, gameResult, isOfficial) {
        let matchDto = new match_dto_1.MatchDto;
        [matchDto.winner, matchDto.loser] =
            this.createPlayerEntities(players, gameResult);
        matchDto.official = isOfficial;
        return (await this.matchService.addMatch(matchDto));
    }
    getWinner(playerA, gameResult) {
        return (playerA.nickName === gameResult.winnerNick
            ? 0 : 1);
    }
    async endGame(gameId, gameResult) {
        const players = this.gamePlayers.get(gameId);
        let isOfficial;
        let winner;
        isOfficial = this.isOfficial(gameId);
        winner = this.getWinner(players[0], gameResult);
        if (!(await this.saveMatch(players, gameResult, isOfficial)))
            console.error(`Failed database insertion for match: ${gameId}`);
        if (isOfficial) {
            if (!(await this.updatePlayerRankings(players, winner)))
                return;
        }
        players[0] = undefined;
        players[1] = undefined;
        return;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        game_rankingService_1.GameRankingService,
        game_queueService_1.GameQueueService,
        match_service_1.MatchService])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map