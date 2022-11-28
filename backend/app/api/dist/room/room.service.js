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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("../user/user.service");
const roles_entity_1 = require("./entities/roles.entity");
const roles_repository_1 = require("./repositories/roles.repository");
const room_entity_1 = require("./entities/room.entity");
const room_mapper_1 = require("./room.mapper");
const room_repository_1 = require("./repositories/room.repository");
const bcrypt = require("bcrypt");
const roles_enum_1 = require("./roles.enum");
let RoomService = class RoomService {
    constructor(roomRepository, rolesRepository, roomMapper, userService) {
        this.roomRepository = roomRepository;
        this.rolesRepository = rolesRepository;
        this.roomMapper = roomMapper;
        this.userService = userService;
    }
    async getAllRooms() {
        return await this.roomRepository.find();
    }
    async findOne(name) {
        return await this.roomRepository.findOne({
            where: {
                name: name,
            }
        });
    }
    async joinRoom(roomLogin) {
        const { name, user } = roomLogin;
        const roomEntity = await this.roomRepository.findOne({
            where: {
                name: name,
            }
        });
        const userEntity = await this.userService.findOne(user);
        if (roomEntity === undefined) {
            throw new common_1.HttpException('Room does not exist in db', common_1.HttpStatus.BAD_REQUEST);
        }
        const newRole = new roles_entity_1.RolesEntity(userEntity, roomEntity);
        await this.rolesRepository.save(newRole);
        return roomEntity;
    }
    async createRoom(roomLogin) {
        const { name, password, user } = roomLogin;
        const roomDto = {
            name: name,
            password: password,
        };
        const ownerEntity = await this.userService.findOne(user);
        if (ownerEntity === undefined) {
            throw new common_1.HttpException('User currently not in db', common_1.HttpStatus.UNAUTHORIZED);
        }
        const roomEntity = this.roomMapper.toEntity(roomDto, ownerEntity);
        const roomInDb = await this.roomRepository.findOne({
            where: {
                name: roomEntity.name
            }
        });
        if (roomInDb != undefined) {
            throw new common_1.HttpException('Room already in db', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.roomRepository.save(roomEntity);
        return roomEntity;
    }
    async loginToRoom(loginInfo) {
        const roomEntity = await this.roomRepository.findOne({
            where: {
                name: loginInfo.name
            }
        });
        if (roomEntity === undefined) {
            throw new common_1.HttpException('Room does not exist in db', common_1.HttpStatus.BAD_REQUEST);
        }
        if (roomEntity.password === null) {
            return true;
        }
        if (loginInfo.password === undefined) {
            return false;
        }
        return await bcrypt.compare(loginInfo.password, roomEntity.password);
    }
    async getUserRole(user, room) {
        const roleArray = await this.rolesRepository.find({
            select: ["role"],
            where: {
                role_user: user,
                role_room: room,
            }
        });
        if (roleArray.length === 0) {
            return roles_enum_1.Roles.NOT_IN_ROOM;
        }
        return roleArray[0].role;
    }
    async authRole(userRoleCreds, allowedRole) {
        const { user, room } = userRoleCreds;
        if (user === undefined || room === undefined) {
            return false;
        }
        const userRole = await this.getUserRole(user, room);
        return (userRole >= allowedRole);
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.RoomEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(roles_entity_1.RolesEntity)),
    __metadata("design:paramtypes", [room_repository_1.RoomRepository,
        roles_repository_1.RolesRepository,
        room_mapper_1.RoomMapper,
        user_service_1.UserService])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map