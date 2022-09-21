import { Module } from '@nestjs/common';
import { RolesUserController } from './roles_user.controller';
import { RolesUserService } from './roles_user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { RolesUserEntity } from './entities/roles_user.entity';

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
