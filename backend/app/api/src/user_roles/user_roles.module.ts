import { Module } from '@nestjs/common';
import { RolesUserController } from './user_roles.controller';
import { RolesUserService } from './user_roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { RolesUserEntity } from './entity/user_roles.entity';
import { RolesModule } from 'src/roles/roles.module';;

@Module({
    imports: [
        TypeOrmModule.forFeature([RolesUserEntity]),
        UserModule,
        RolesModule,
    ],
    controllers: [RolesUserController],
    providers: [RolesUserService],
    exports: [],
})
export class RolesUserModule { }
