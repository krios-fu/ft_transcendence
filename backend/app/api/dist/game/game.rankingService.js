"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRankingService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/user.entity");
let GameRankingService = class GameRankingService {
    getCategory(ranking) {
        if (ranking >= 2500)
            return (user_entity_1.Category.Platinum);
        if (ranking >= 2000)
            return (user_entity_1.Category.Gold);
        if (ranking >= 1500)
            return (user_entity_1.Category.Silver);
        if (ranking >= 1000)
            return (user_entity_1.Category.Bronze);
        return (user_entity_1.Category.Iron);
    }
    getK(category) {
        if (category === user_entity_1.Category.Pending)
            return (200);
        return (32);
    }
    calcRankingUpdate(ranking, kFactor, win, expectedScore) {
        const winBin = win ? 1 : 0;
        return (Math.round(ranking + kFactor * (winBin - expectedScore)));
    }
    update(targetData, rivalData, win, expect) {
        if (targetData.category === user_entity_1.Category.Pending
            || rivalData.category != user_entity_1.Category.Pending) {
            return (this.calcRankingUpdate(targetData.ranking, this.getK(targetData.category), win, expect));
        }
        return (targetData.ranking);
    }
    calcExpectedScore(targetRanking, rivalRanking) {
        return (1 / (1 + Math.pow(10, (rivalRanking - targetRanking) / 400)));
    }
    updateRanking(aData, bData, win) {
        let expectA;
        let expectB;
        let updateA;
        let updateB;
        expectA = this.calcExpectedScore(aData.ranking, bData.ranking);
        expectB = this.calcExpectedScore(bData.ranking, aData.ranking);
        updateA = this.update(aData, bData, win === 0, expectA);
        updateB = this.update(bData, aData, win === 1, expectB);
        return ([updateA, updateB]);
    }
};
GameRankingService = __decorate([
    (0, common_1.Injectable)()
], GameRankingService);
exports.GameRankingService = GameRankingService;
//# sourceMappingURL=game.rankingService.js.map