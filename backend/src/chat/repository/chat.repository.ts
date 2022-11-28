import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {ChatEntity} from "../entities/chat.entity";

@Injectable()
export class ChatRepository extends Repository<ChatEntity> { }
