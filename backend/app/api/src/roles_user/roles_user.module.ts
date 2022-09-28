import { Module } from '@nestjs/common';
import { RolesUserController } from './roles_user.controller';
import { RolesUserService } from './roles_user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { RolesUserEntity } from './entity/roles_user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { RolesUserMapper } from './roles_user.mapper';

@Module({
    imports: [
        TypeOrmModule.forFeature([RolesUserEntity]),
        UserModule,
        RolesModule,
    ],
    controllers: [RolesUserController],
    providers: [
        RolesUserService,
        RolesUserMapper,
    ],
    exports: [],
})
export class RolesUserModule { }
