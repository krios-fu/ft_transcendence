import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
    async findByUsername(username: string): Promise<UsersEntity> {
        return await this.findOne({ username });
    }
}
