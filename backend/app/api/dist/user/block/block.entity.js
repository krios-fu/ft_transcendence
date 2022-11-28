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
exports.BlockEntity = void 0;
const typeorm_1 = require("typeorm");
const friendship_entity_1 = require("../friendship/friendship.entity");
const user_entity_1 = require("../user.entity");
let BlockEntity = class BlockEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BlockEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => friendship_entity_1.FriendshipEntity, (friendship) => friendship.block),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", friendship_entity_1.FriendshipEntity)
], BlockEntity.prototype, "friendship", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)({
        name: "blockSender"
    }),
    __metadata("design:type", user_entity_1.UserEntity)
], BlockEntity.prototype, "blockSender", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BlockEntity.prototype, "since", void 0);
BlockEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: "block"
    })
], BlockEntity);
exports.BlockEntity = BlockEntity;
//# sourceMappingURL=block.entity.js.map