import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserServices } from './user.service';
import { UserPwEntity } from './user.pw.entity';



@Module({
    imports: [TypeOrmModule.forFeature([UserPwEntity])],
    controllers: [UserController],
    providers: [UserServices],
    exports: [UserServices],
})
export class UserModule {}
