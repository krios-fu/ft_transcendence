import { Module } from '@nestjs/common';
import { UserRolesController } from './user_roles.controller';
import { UserRolesService } from './user_roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserRolesEntity } from './entity/user_roles.entity';
import { RolesModule } from 'src/roles/roles.module';;

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRolesEntity]),
        UserModule,
        RolesModule,
    ],
    controllers: [UserRolesController],
    providers: [UserRolesService],
    exports: [UserRolesService],
})
export class UserRolesModule { }
