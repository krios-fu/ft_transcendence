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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipEntity = exports.FriendshipStatus = void 0;
const typeorm_1 = require("typeorm");
const block_entity_1 = require("../block/block.entity");
const user_entity_1 = require("../user.entity");
var FriendshipStatus;
(function (FriendshipStatus) {
    FriendshipStatus["PENDING"] = "pending";
    FriendshipStatus["CONFIRMED"] = "confirmed";
    FriendshipStatus["BLOCKED"] = "blocked";
})(FriendshipStatus = exports.FriendshipStatus || (exports.FriendshipStatus = {}));
let FriendshipEntity = class FriendshipEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], FriendshipEntity.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)({
        name: 'senderId',
    }),
    __metadata("design:type", user_entity_1.UserEntity)
], FriendshipEntity.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], FriendshipEntity.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)({
        name: 'receiverId'
    }),
    __metadata("design:type", user_entity_1.UserEntity)
], FriendshipEntity.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: FriendshipStatus.PENDING
    }),
    __metadata("design:type", String)
], FriendshipEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FriendshipEntity.prototype, "since", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => block_entity_1.BlockEntity, (block) => block.friendship, {
        cascade: true
    }),
    __metadata("design:type", typeof (_a = typeof block_entity_1.BlockEntity !== "undefined" && block_entity_1.BlockEntity) === "function" ? _a : Object)
], FriendshipEntity.prototype, "block", void 0);
FriendshipEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'friendship'
    })
], FriendshipEntity);
exports.FriendshipEntity = FriendshipEntity;
//# sourceMappingURL=friendship.entity.js.map