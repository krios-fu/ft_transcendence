import { Repository } from 'typeorm';
import { ChatMessageEntity } from "../entities/chat-message.entity";
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessageRepository extends Repository<ChatMessageEntity> { }
