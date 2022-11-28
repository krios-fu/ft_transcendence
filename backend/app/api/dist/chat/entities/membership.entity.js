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
exports.MembershipEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/user.entity");
const chat_entity_1 = require("./chat.entity");
let MembershipEntity = class MembershipEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MembershipEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MembershipEntity.prototype, "begin_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.membership, { eager: true }),
    __metadata("design:type", user_entity_1.UserEntity)
], MembershipEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_entity_1.ChatEntity, (chat) => chat.membership),
    __metadata("design:type", chat_entity_1.ChatEntity)
], MembershipEntity.prototype, "chat", void 0);
MembershipEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'membership'
    })
], MembershipEntity);
exports.MembershipEntity = MembershipEntity;
//# sourceMappingURL=membership.entity.js.map