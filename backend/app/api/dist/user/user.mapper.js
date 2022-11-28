"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./user.entity");
const user_dto_1 = require("./user.dto");
let UserMapper = class UserMapper {
    toEntity(userDto) {
        const newEntity = new user_entity_1.UserEntity;
        newEntity.username = userDto.username;
        newEntity.firstName = userDto.firstName;
        newEntity.lastName = userDto.lastName;
        newEntity.profileUrl = userDto.profileUrl;
        newEntity.email = userDto.email;
        newEntity.photoUrl = userDto.photoUrl;
        newEntity.nickName = newEntity.username;
        return newEntity;
    }
    toDto(userEntity) {
        const newDto = new user_dto_1.UserDto;
        newDto.username = userEntity.username;
        newDto.firstName = userEntity.firstName;
        newDto.lastName = userEntity.lastName;
        newDto.profileUrl = userEntity.profileUrl;
        newDto.email = userEntity.email;
        newDto.photoUrl = userEntity.photoUrl;
        return newDto;
    }
};
UserMapper = __decorate([
    (0, common_1.Injectable)()
], UserMapper);
exports.UserMapper = UserMapper;
//# sourceMappingURL=user.mapper.js.map