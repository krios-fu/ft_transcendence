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
exports.ChatEntity = void 0;
const typeorm_1 = require("typeorm");
const message_entity_1 = require("./message.entity");
const membership_entity_1 = require("./membership.entity");
let ChatEntity = class ChatEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChatEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatEntity.prototype, "begin_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => membership_entity_1.MembershipEntity, (members) => members.chat, { eager: true }),
    __metadata("design:type", Array)
], ChatEntity.prototype, "membership", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.MessageEntity, (messages) => messages.chat, { eager: true }),
    __metadata("design:type", Array)
], ChatEntity.prototype, "messages", void 0);
ChatEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'chats'
    })
], ChatEntity);
exports.ChatEntity = ChatEntity;
//# sourceMappingURL=chat.entity.js.map