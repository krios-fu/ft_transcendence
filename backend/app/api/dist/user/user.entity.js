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
exports.UserEntity = exports.Category = void 0;
const typeorm_1 = require("typeorm");
const message_entity_1 = require("../chat/entities/message.entity");
const membership_entity_1 = require("../chat/entities/membership.entity");
var Category;
(function (Category) {
    Category[Category["Pending"] = 0] = "Pending";
    Category[Category["Iron"] = 1] = "Iron";
    Category[Category["Bronze"] = 2] = "Bronze";
    Category[Category["Silver"] = 3] = "Silver";
    Category[Category["Gold"] = 4] = "Gold";
    Category[Category["Platinum"] = 5] = "Platinum";
})(Category = exports.Category || (exports.Category = {}));
let UserEntity = class UserEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "profileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "nickName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "doubleAuth", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 1500
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "ranking", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: Category.Pending
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "creationDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "lastConnection", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => message_entity_1.MessageEntity, (message) => message.author),
    __metadata("design:type", Array)
], UserEntity.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => membership_entity_1.MembershipEntity, (membership) => membership.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "membership", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'user'
    })
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map