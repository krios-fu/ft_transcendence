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
exports.RefreshTokenEntity = void 0;
const user_entity_1 = require("../../user/user.entity");
const typeorm_1 = require("typeorm");
let RefreshTokenEntity = class RefreshTokenEntity {
    constructor(refreshToken) {
        if (refreshToken != undefined) {
            this.authUser = refreshToken.authUser;
            this.expiresIn = refreshToken.expiresIn;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'token_user' }),
    __metadata("design:type", user_entity_1.UserEntity)
], RefreshTokenEntity.prototype, "authUser", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: Date,
    }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "expiresIn", void 0);
RefreshTokenEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'refresh_token' }),
    __metadata("design:paramtypes", [Object])
], RefreshTokenEntity);
exports.RefreshTokenEntity = RefreshTokenEntity;
//# sourceMappingURL=refresh-token.entity.js.map