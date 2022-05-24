import { Controller } from '@nestjs/common';
import { UserDto } from './users.dto';
import { UserEntity } from './users.entity';

@Controller('users')
export class UsersController {

    @Get()
    getUsers(): UserEntity[] {
    }

    @Post()
    postUser(@Body user: UserDto): {
    }
}
