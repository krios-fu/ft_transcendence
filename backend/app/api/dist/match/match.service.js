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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const match_entity_1 = require("./match.entity");
const match_mapper_1 = require("./match.mapper");
const match_repository_1 = require("./match.repository");
let MatchService = class MatchService {
    constructor(matchRepository, matchMapper) {
        this.matchRepository = matchRepository;
        this.matchMapper = matchMapper;
        console.log("MatchService initiated.");
    }
    async findAllMatches() {
        return await this.matchRepository.find();
    }
    async findUserMatches(userId) {
        return (await this.matchRepository.createQueryBuilder("match")
            .leftJoinAndSelect("match.winner", "winner")
            .leftJoinAndSelect("match.loser", "loser")
            .leftJoinAndSelect("winner.user", "winnerUser")
            .leftJoinAndSelect("loser.user", "loserUser")
            .select([
            "match.official",
            "match.playedAt",
            "winner.score",
            "loser.score",
            "winnerUser.nickName",
            "loserUser.nickName",
            "winnerUser.photoUrl",
            "loserUser.photoUrl"
        ])
            .where("winnerUser.username= :id", { id: userId })
            .orWhere("loserUser.username= :id", { id: userId })
            .getMany());
    }
    async findOneMatch(matchId) {
        return await this.matchRepository.findOne({
            where: {
                id: matchId
            }
        });
    }
    async addMatch(matchDto) {
        const matchEntity = this.matchMapper.toEntity(matchDto);
        try {
            await this.matchRepository.save(matchEntity);
        }
        catch (err) {
            console.log(err);
            return (null);
        }
        return (matchEntity);
    }
    async countUserMatches(userId) {
        return (await this.matchRepository.count({
            where: [
                {
                    winner: {
                        user: {
                            username: userId
                        }
                    }
                },
                {
                    loser: {
                        user: {
                            username: userId
                        }
                    }
                }
            ]
        }));
    }
};
MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.MatchEntity)),
    __metadata("design:paramtypes", [match_repository_1.MatchRepository,
        match_mapper_1.MatchMapper])
], MatchService);
exports.MatchService = MatchService;
//# sourceMappingURL=match.service.js.map