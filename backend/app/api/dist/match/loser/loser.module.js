"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const loser_entity_1 = require("./loser.entity");
const loser_mapper_1 = require("./loser.mapper");
const loser_repository_1 = require("./loser.repository");
const loser_service_1 = require("./loser.service");
let LoserModule = class LoserModule {
};
LoserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([loser_entity_1.LoserEntity])
        ],
        exports: [loser_service_1.LoserService],
        providers: [
            loser_service_1.LoserService,
            loser_mapper_1.LoserMapper,
            loser_repository_1.LoserRepository
        ]
    })
], LoserModule);
exports.LoserModule = LoserModule;
//# sourceMappingURL=loser.module.js.map