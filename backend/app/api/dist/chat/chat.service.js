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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const chat_repository_1 = require("./repository/chat.repository");
const chat_mapper_1 = require("./mapper/chat.mapper");
let ChatService = class ChatService {
    constructor(chatRepository, chatMapper) {
        this.chatRepository = chatRepository;
        this.chatMapper = chatMapper;
    }
    async findChats() {
        return await this.chatRepository.find();
    }
    async findOne(id_chat) {
        return await this.chatRepository.find({
            select: {
                membership: true,
                messages: false
            },
            where: {
                id: id_chat,
            }
        });
    }
    async findChatsUser(id_user) {
        return await this.chatRepository.find({
            where: {
                membership: {
                    user: {
                        nickName: id_user,
                    }
                }
            },
            order: {
                messages: {
                    id: "ASC",
                }
            }
        });
    }
    async findChatUser(id_user, id_friend) {
        let chats = await this.chatRepository.find({
            where: {
                membership: {
                    user: {
                        nickName: id_user,
                    }
                }
            },
            order: {
                messages: {
                    id: "ASC",
                }
            }
        });
        return chats.filter((chat) => {
            return chat.membership[0].user.username == id_friend
                || chat.membership[1].user.username == id_friend;
        });
    }
    async post(chat) {
        const mapper = this.chatMapper.toEntity(chat);
        await this.chatRepository.insert(mapper);
        throw new common_1.HttpException('Chat alrady exists', common_1.HttpStatus.BAD_REQUEST);
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.ChatEntity)),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository,
        chat_mapper_1.ChatMapper])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map