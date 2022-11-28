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
exports.RoomEntity = void 0;
const user_entity_1 = require("../../user/user.entity");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
let RoomEntity = class RoomEntity {
    constructor(name, owner, password) {
        this.name = name;
        this.owner = owner;
        this.password = password;
        this.date = new Date();
    }
    async encryptPassword() {
        if (this.password != undefined) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "varchar",
        unique: true,
        length: 15,
    }),
    __metadata("design:type", String)
], RoomEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        nullable: true,
    }),
    __metadata("design:type", String)
], RoomEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomEntity.prototype, "encryptPassword", null);
__decorate([
    (0, typeorm_1.Column)({ type: Date }),
    __metadata("design:type", Date)
], RoomEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, {
        cascade: ['remove'],
        eager: true
    }),
    (0, typeorm_1.JoinColumn)({ name: "owner_user" }),
    __metadata("design:type", user_entity_1.UserEntity)
], RoomEntity.prototype, "owner", void 0);
RoomEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "room" }),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity, String])
], RoomEntity);
exports.RoomEntity = RoomEntity;
//# sourceMappingURL=room.entity.js.map