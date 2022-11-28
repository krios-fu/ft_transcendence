"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const message_entity_1 = require("./entities/message.entity");
const user_module_1 = require("../user/user.module");
const chat_gateway_1 = require("./chat.gateway");
const membership_entity_1 = require("./entities/membership.entity");
const chat_service_1 = require("./chat.service");
const chat_controller_1 = require("./chat.controller");
const chat_mapper_1 = require("./mapper/chat.mapper");
const message_controller_1 = require("./message/message.controller");
const message_service_1 = require("./message/message.service");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                chat_entity_1.ChatEntity,
                message_entity_1.MessageEntity,
                membership_entity_1.MembershipEntity,
            ]),
            user_module_1.UserModule,
        ],
        exports: [chat_service_1.ChatService],
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService, chat_mapper_1.ChatMapper, message_service_1.MessageService],
        controllers: [chat_controller_1.ChatController, message_controller_1.MessageController],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map