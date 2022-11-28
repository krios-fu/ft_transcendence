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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const room_dto_1 = require("./dto/room.dto");
const room_service_1 = require("./room.service");
const private_room_guard_1 = require("./guard/private-room.guard");
const roles_enum_1 = require("./roles.enum");
const room_roles_guard_1 = require("./guard/room-roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const login_info_dto_1 = require("./dto/login-info.dto");
let RoomController = class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    async joinRoom(loginInfo) {
        return await this.roomService.joinRoom(loginInfo);
    }
    async createRoom(req, roomDto) {
        const roomLogin = {
            "user": req.username,
            "name": roomDto.name,
            "password": roomDto.password,
        };
        return await this.roomService.createRoom(roomLogin);
    }
    async getRoom(name) {
        return await this.roomService.findOne(name);
    }
    async getAllRooms() {
        return await this.roomService.getAllRooms();
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.MinRoleAllowed)(roles_enum_1.Roles.NOT_IN_ROOM),
    (0, common_1.UseGuards)(private_room_guard_1.PrivateRoomGuard),
    (0, common_1.UseGuards)(room_roles_guard_1.RoomRolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_info_dto_1.LoginInfoDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)('new'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, room_dto_1.RoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)(':name'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoom", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getAllRooms", null);
RoomController = __decorate([
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map