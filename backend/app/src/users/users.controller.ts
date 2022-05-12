import { Controller } from '@nestjs/common';
import { UserDto } from './user.dto';

@Controller('users')
export class UsersController {

    @Get()
    function getUsers(): UserDto[] {
    }

    @Post()
    function postUser(@Body user: UserDto): {
    }
}
