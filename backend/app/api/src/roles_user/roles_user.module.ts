import { Module } from '@nestjs/common';
import { RolesUserController } from './roles_user.controller';
import { RolesUserService } from './roles_user.service';
import { RolesUserEntity } from './entity/roles_user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RolesUserEntity]),
        UserModule,
    ],
    controllers: [RolesUserController],
    providers: [RolesUserService],
    exports: [],
})
export class RolesUserModule { }
