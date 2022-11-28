"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModule = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
const room_controller_1 = require("./room.controller");
const typeorm_1 = require("@nestjs/typeorm");
const room_entity_1 = require("./entities/room.entity");
const room_repository_1 = require("./repositories/room.repository");
const room_mapper_1 = require("./room.mapper");
const roles_repository_1 = require("./repositories/roles.repository");
const user_module_1 = require("../user/user.module");
const roles_entity_1 = require("./entities/roles.entity");
let RoomModule = class RoomModule {
};
RoomModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                room_entity_1.RoomEntity,
                roles_entity_1.RolesEntity
            ]),
            user_module_1.UserModule,
        ],
        controllers: [room_controller_1.RoomController],
        providers: [
            room_service_1.RoomService,
            room_repository_1.RoomRepository,
            room_mapper_1.RoomMapper,
            roles_repository_1.RolesRepository
        ],
        exports: []
    })
], RoomModule);
exports.RoomModule = RoomModule;
//# sourceMappingURL=room.module.js.map