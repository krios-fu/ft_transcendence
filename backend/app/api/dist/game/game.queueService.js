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
exports.GameQueueService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/user.entity");
const user_service_1 = require("../user/user.service");
let GameQueueService = class GameQueueService {
    constructor(userService) {
        this.userService = userService;
        this.gameQueue = new Map;
    }
    getNextPlayers(gameId) {
        let queue = this.gameQueue.get(gameId);
        let playerA = undefined;
        let playerB = undefined;
        let maxCategoryDiff = 0;
        let categoryDiff;
        if (!queue
            || queue.length < 2)
            return ([playerA, playerB]);
        playerA = queue[0];
        while (playerB === undefined) {
            for (let i = 1; i < queue.length; ++i) {
                categoryDiff = Math.abs(playerA.category - queue[i].category);
                if (categoryDiff <= maxCategoryDiff
                    || queue[i].category === user_entity_1.Category.Pending) {
                    playerB = queue[i];
                    break;
                }
            }
            ++maxCategoryDiff;
        }
        return ([playerA, playerB]);
    }
    findByUsername(username, queue) {
        return (queue.findIndex((elem) => elem.username === username));
    }
    async add(gameId, username) {
        let targetIndex;
        let userEntity = await this.userService.findOne(username);
        let queue = this.gameQueue.get(gameId);
        if (!queue)
            queue = this.gameQueue.set(gameId, []).get(gameId);
        targetIndex = this.findByUsername(username, queue);
        if (targetIndex === -1
            && userEntity)
            queue.push(userEntity);
    }
    remove(gameId, username) {
        let targetIndex;
        let queue = this.gameQueue.get(gameId);
        if (!queue || username === "")
            return;
        targetIndex = this.findByUsername(username, queue);
        if (targetIndex !== -1)
            queue.splice(targetIndex, 1);
    }
};
GameQueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], GameQueueService);
exports.GameQueueService = GameQueueService;
//# sourceMappingURL=game.queueService.js.map