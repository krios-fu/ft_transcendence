import { Module } from '@nestjs/common';
import { UserRolesController } from './user_roles.controller';
import { UserRolesService } from './user_roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserRolesEntity } from './entity/user_roles.entity';
import { RolesModule } from '../roles/roles.module';
import {SocketHelper} from "../game/game.socket.helper";

;

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRolesEntity]),
        UserModule,
        RolesModule,
    ],
    controllers: [UserRolesController],
    providers: [
        SocketHelper,
        UserRolesService,
    ],
    exports: [UserRolesService],
})
export class UserRolesModule { }
