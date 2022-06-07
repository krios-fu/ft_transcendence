import { Repository } from 'typeorm';
import { UsersEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> { }
