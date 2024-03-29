import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<UserEntity> { }
