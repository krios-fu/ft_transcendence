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
exports.RoomRolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const room_service_1 = require("../room.service");
let RoomRolesGuard = class RoomRolesGuard {
    constructor(reflector, roomService) {
        this.reflector = reflector;
        this.roomService = roomService;
    }
    canActivate(ctxt) {
        const allowedRole = this.reflector.get(roles_decorator_1.ROLES_KEY, ctxt.getHandler());
        const req = ctxt.switchToHttp().getRequest();
        const bodyDto = req.body;
        return this.roomService.authRole(bodyDto, allowedRole);
    }
};
RoomRolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        room_service_1.RoomService])
], RoomRolesGuard);
exports.RoomRolesGuard = RoomRolesGuard;
//# sourceMappingURL=room-roles.guard.js.map