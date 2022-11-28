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
exports.WinnerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const winner_entity_1 = require("./winner.entity");
const winner_mapper_1 = require("./winner.mapper");
const winner_repository_1 = require("./winner.repository");
let WinnerService = class WinnerService {
    constructor(winnerRepository, winnerMapper) {
        this.winnerRepository = winnerRepository;
        this.winnerMapper = winnerMapper;
    }
    async AddWinner(winnerDto) {
        const winnerEntity = new winner_entity_1.WinnerEntity;
        this.winnerMapper.toEntity(winnerDto, winnerEntity);
        try {
            this.winnerRepository.insert(winnerEntity);
        }
        catch (err) {
            console.log(err);
            return (null);
        }
        return (winnerEntity);
    }
};
WinnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(winner_entity_1.WinnerEntity)),
    __metadata("design:paramtypes", [winner_repository_1.WinnerRepository,
        winner_mapper_1.WinnerMapper])
], WinnerService);
exports.WinnerService = WinnerService;
//# sourceMappingURL=winner.service.js.map