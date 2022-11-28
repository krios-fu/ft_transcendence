"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const loser_module_1 = require("../match/loser/loser.module");
const match_module_1 = require("../match/match.module");
const winner_module_1 = require("../match/winner/winner.module");
const user_module_1 = require("../user/user.module");
const game_gateway_1 = require("./game.gateway");
const game_queueService_1 = require("./game.queueService");
const game_rankingService_1 = require("./game.rankingService");
const game_service_1 = require("./game.service");
const game_socket_helper_1 = require("./game.socket.helper");
const game_updateService_1 = require("./game.updateService");
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            match_module_1.MatchModule,
            winner_module_1.WinnerModule,
            loser_module_1.LoserModule
        ],
        providers: [
            game_gateway_1.GameGateway,
            game_service_1.GameService,
            game_queueService_1.GameQueueService,
            game_updateService_1.GameUpdateService,
            game_rankingService_1.GameRankingService,
            game_socket_helper_1.SocketHelper
        ],
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map