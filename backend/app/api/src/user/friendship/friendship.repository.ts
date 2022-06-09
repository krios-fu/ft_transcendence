import { Repository } from 'typeorm';
import { FriendshipEntity } from './frienship.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendshipRepository extends Repository<FriendshipEntity> { }