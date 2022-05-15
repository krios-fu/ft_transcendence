import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
    controllers: [UserController],
    providers: [UserService, UsersRepository, UserMapper]
})
export class UserModule {}