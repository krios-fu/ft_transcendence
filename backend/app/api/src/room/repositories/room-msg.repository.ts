import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomMsgEntity } from '../entities/room-msg.entity';

@Injectable()
export class RoomMsgRepository extends Repository<RoomMsgEntity> { }
