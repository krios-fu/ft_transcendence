"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendMapper = void 0;
const friendship_dto_1 = require("./friendship.dto");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user.entity");
let FriendMapper = class FriendMapper {
    toFriendDto(userId, friendship) {
        const friend = new friendship_dto_1.FriendDto();
        friend.user = friendship.sender.username != userId
            ? friendship.sender : friendship.receiver;
        friend.status = friendship.status;
        friend.since = friendship.since;
        return (friend);
    }
    toBlockedFriendDto(userId, friendship) {
        const friend = new friendship_dto_1.FriendDto();
        friend.user = new user_entity_1.UserEntity();
        friend.user.nickName = friendship.senderId != userId
            ? friendship.sender.nickName : friendship.receiver.nickName;
        return (friend);
    }
};
FriendMapper = __decorate([
    (0, common_1.Injectable)()
], FriendMapper);
exports.FriendMapper = FriendMapper;
//# sourceMappingURL=friendship.mapper.js.map