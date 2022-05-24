import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserServices } from './user.services';
import { UserEntity } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [UsersService],
    controllers: [UserController],
    providers: [UserServices],
})
export class UserModule {}
