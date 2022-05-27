import {
    Controller,
    Get,
    Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UsersDto } from './users.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {
        console.log("UsersController inicializado");
    }

    @Get()
    async findAllUsers(): Promise<UsersEntity[]> {
        return this.usersService.findAllUsers();
    }

    @Post('new')
    async postUser(newUser: UsersDto): Promise<UsersEntity> {
        return this.usersService.postUser(newUser);
    }
}
