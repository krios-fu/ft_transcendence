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
exports.LoserEntity = void 0;
const user_entity_1 = require("../../user/user.entity");
const match_entity_1 = require("../match.entity");
const typeorm_1 = require("typeorm");
let LoserEntity = class LoserEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LoserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], LoserEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => match_entity_1.MatchEntity, (match) => match.loser),
    __metadata("design:type", match_entity_1.MatchEntity)
], LoserEntity.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LoserEntity.prototype, "score", void 0);
LoserEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'loser'
    })
], LoserEntity);
exports.LoserEntity = LoserEntity;
//# sourceMappingURL=loser.entity.js.map