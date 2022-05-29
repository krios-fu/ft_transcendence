import {
    Controller,
    Get,
    Post,
    Param,
    Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UsersDto } from './users.dto';
import { Public } from '../auth/public.decorator';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {
        console.log("UsersController inicializado");
    }

    @Public()
    @Get()
    async findAllUsers(): Promise<UsersEntity[]> {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UsersEntity> {
        return this.usersService.findOne(id);
    }

    @Post('new')
    async postUser(@Body() newUser: UsersDto): Promise<UsersEntity> {
        return this.usersService.postUser(newUser);
    }
}
