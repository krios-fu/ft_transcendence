"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMapper = void 0;
const common_1 = require("@nestjs/common");
const match_entity_1 = require("./match.entity");
let MatchMapper = class MatchMapper {
    toEntity(matchDto) {
        const matchEntity = new match_entity_1.MatchEntity();
        matchEntity.winner = matchDto.winner;
        matchEntity.loser = matchDto.loser;
        matchEntity.official = matchDto.official;
        return (matchEntity);
    }
};
MatchMapper = __decorate([
    (0, common_1.Injectable)()
], MatchMapper);
exports.MatchMapper = MatchMapper;
//# sourceMappingURL=match.mapper.js.map