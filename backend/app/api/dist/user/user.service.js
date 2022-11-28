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
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const user_mapper_1 = require("./user.mapper");
const user_entity_1 = require("./user.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
let UserService = class UserService {
    constructor(userRepository, userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        console.log("UserService inicializado");
    }
    async findAllUsers() {
        return await this.userRepository.find();
    }
    async findOne(id) {
        return await this.userRepository.findOne({
            where: {
                username: id
            }
        });
    }
    async postUser(newUser) {
        const newEntity = this.userMapper.toEntity(newUser);
        try {
            await this.userRepository.insert(newEntity);
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        return newEntity;
    }
    async updateUser(id, data) {
        return await this.userRepository.update(id, data);
    }
    async deleteUser(id) {
        await this.userRepository.delete(id);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        user_mapper_1.UserMapper])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map