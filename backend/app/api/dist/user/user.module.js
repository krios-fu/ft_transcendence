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
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("./user.repository");
const user_mapper_1 = require("./user.mapper");
const friendship_controller_1 = require("./friendship/friendship.controller");
const friendship_service_1 = require("./friendship/friendship.service");
const friendship_repository_1 = require("./friendship/friendship.repository");
const friendship_mapper_1 = require("./friendship/friendship.mapper");
const friendship_entity_1 = require("./friendship/friendship.entity");
const block_controller_1 = require("./block/block.controller");
const block_service_1 = require("./block/block.service");
const block_repository_1 = require("./block/block.repository");
const block_entity_1 = require("./block/block.entity");
const chat_service_1 = require("../chat/chat.service");
const chat_entity_1 = require("../chat/entities/chat.entity");
const chat_mapper_1 = require("../chat/mapper/chat.mapper");
let UserModule = class UserModule {
    constructor() {
        console.log("UserModule inicializado");
    }
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, friendship_entity_1.FriendshipEntity, block_entity_1.BlockEntity, chat_entity_1.ChatEntity])
        ],
        exports: [user_service_1.UserService],
        controllers: [user_controller_1.UserController, friendship_controller_1.FriendshipController, block_controller_1.BlockController],
        providers: [
            user_service_1.UserService,
            user_repository_1.UserRepository,
            user_mapper_1.UserMapper,
            friendship_service_1.FriendshipService,
            friendship_repository_1.FriendshipRepository,
            friendship_mapper_1.FriendMapper,
            block_service_1.BlockService,
            block_repository_1.BlockRepository,
            chat_service_1.ChatService,
            chat_mapper_1.ChatMapper
        ]
    }),
    __metadata("design:paramtypes", [])
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map