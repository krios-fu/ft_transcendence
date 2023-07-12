import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FriendshipEntity } from '../entities/friendship.entity';

@Injectable()
export class FriendshipRepository extends Repository<FriendshipEntity> { }
