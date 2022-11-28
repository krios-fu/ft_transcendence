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
exports.RolesEntity = void 0;
const user_entity_1 = require("../../user/user.entity");
const typeorm_1 = require("typeorm");
const roles_enum_1 = require("../roles.enum");
const room_entity_1 = require("./room.entity");
let RolesEntity = class RolesEntity {
    constructor(user, room, role = roles_enum_1.Roles.USER, date = null) {
        this.user = user;
        this.room = room;
        this.role = role;
        this.silencedDate = date;
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], RolesEntity.prototype, "role_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, {
        cascade: ["remove"],
    }),
    (0, typeorm_1.JoinColumn)({ name: "role_user" }),
    __metadata("design:type", user_entity_1.UserEntity)
], RolesEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], RolesEntity.prototype, "role_room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.RoomEntity, {
        cascade: ["remove"],
    }),
    (0, typeorm_1.JoinColumn)({ name: "role_room" }),
    __metadata("design:type", room_entity_1.RoomEntity)
], RolesEntity.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: roles_enum_1.Roles,
        default: roles_enum_1.Roles.USER,
        nullable: false
    }),
    __metadata("design:type", Number)
], RolesEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: Date,
        nullable: true
    }),
    __metadata("design:type", Date)
], RolesEntity.prototype, "silencedDate", void 0);
RolesEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "roles" }),
    __metadata("design:paramtypes", [user_entity_1.UserEntity,
        room_entity_1.RoomEntity, Number, Date])
], RolesEntity);
exports.RolesEntity = RolesEntity;
//# sourceMappingURL=roles.entity.js.map