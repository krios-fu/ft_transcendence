import { Repository } from 'typeorm';
import {MessageEntity} from "../entities/message.entity";
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> { }
