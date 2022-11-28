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
exports.MatchEntity = void 0;
const winner_entity_1 = require("./winner/winner.entity");
const loser_entity_1 = require("./loser/loser.entity");
const typeorm_1 = require("typeorm");
let MatchEntity = class MatchEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MatchEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => winner_entity_1.WinnerEntity, (winner) => winner.match, {
        cascade: true,
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", winner_entity_1.WinnerEntity)
], MatchEntity.prototype, "winner", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => loser_entity_1.LoserEntity, (loser) => loser.match, {
        cascade: true,
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", loser_entity_1.LoserEntity)
], MatchEntity.prototype, "loser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], MatchEntity.prototype, "official", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MatchEntity.prototype, "playedAt", void 0);
MatchEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'match'
    })
], MatchEntity);
exports.MatchEntity = MatchEntity;
//# sourceMappingURL=match.entity.js.map