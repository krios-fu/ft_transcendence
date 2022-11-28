"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMapper = void 0;
const common_1 = require("@nestjs/common");
const chat_dto_1 = require("../dtos/chat.dto");
const chat_entity_1 = require("../entities/chat.entity");
let ChatMapper = class ChatMapper {
    toEntity(chatDto) {
        const newEntity = new chat_entity_1.ChatEntity;
        newEntity.begin_at = chatDto.begin_at;
        return newEntity;
    }
    toDto(chatEntity) {
        const newDto = new chat_dto_1.ChatDto;
        newDto.id = chatEntity.id;
        newDto.membership = chatEntity.membership;
        newDto.messages = chatEntity.messages;
        return newDto;
    }
};
ChatMapper = __decorate([
    (0, common_1.Injectable)()
], ChatMapper);
exports.ChatMapper = ChatMapper;
//# sourceMappingURL=chat.mapper.js.map