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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("../../user/user.service");
const chat_service_1 = require("../chat.service");
const message_entity_1 = require("../entities/message.entity");
const message_repository_1 = require("../repository/message.repository");
let MessageService = class MessageService {
    constructor(messageRepository, userService, chatService) {
        this.messageRepository = messageRepository;
        this.userService = userService;
        this.chatService = chatService;
        console.log('message repo start');
    }
    async findMessages() {
        return await this.messageRepository.find();
    }
    async findOne(id) {
        return await this.messageRepository.findOne({
            where: {
                id: id
            }
        });
    }
    async saveMessages(message) {
        let msg = new message_entity_1.MessageEntity();
        msg.author = await this.userService.findOne(message.sender);
        msg.chat = (await this.chatService.findOne((await this.chatService.findChatUser(msg.author.nickName, message.reciver))[0].id))[0];
        msg.content = message.content;
        await this.messageRepository.insert(msg);
        return msg;
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.MessageEntity)),
    __metadata("design:paramtypes", [message_repository_1.MessageRepository,
        user_service_1.UserService,
        chat_service_1.ChatService])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map