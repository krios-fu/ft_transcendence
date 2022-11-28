"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinnerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const winner_entity_1 = require("./winner.entity");
const winner_mapper_1 = require("./winner.mapper");
const winner_repository_1 = require("./winner.repository");
const winner_service_1 = require("./winner.service");
let WinnerModule = class WinnerModule {
};
WinnerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([winner_entity_1.WinnerEntity])
        ],
        exports: [winner_service_1.WinnerService],
        providers: [
            winner_service_1.WinnerService,
            winner_mapper_1.WinnerMapper,
            winner_repository_1.WinnerRepository
        ]
    })
], WinnerModule);
exports.WinnerModule = WinnerModule;
//# sourceMappingURL=winner.module.js.map