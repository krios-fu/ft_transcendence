import { Module } from '@nestjs/common';
import { RolesUserController } from './roles_user/roles_user.controller';
import { RolesUserController } from './roles_user.controller';
import { RolesUserService } from './roles_user.service';

@Module({
    imports: [],
    controllers: [RolesUserController],
    providers: [RolesUserService],
    exports: [],
})
export class RolesUserModule { }
