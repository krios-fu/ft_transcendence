import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserServices } from './user.service';
import { UserPwEntity } from './user.pw.entity';
import { UserPwMapper } from './user.pw.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([UserPwEntity])],
    controllers: [UserController],
    providers: [UserPwMapper, UserServices],
    exports: [UserServices],
})
export class UserModule {
    constructor() {
        console.log("UserModule inicializado");
    }
}
