import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Patch,
    ParseIntPipe,
    Query,
    Logger,
    HttpException,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import { UpdateResult } from 'typeorm';
import { UserQueryDto } from './user.query.dto';
import { IRequestUser } from 'src/common/interfaces/request-payload.interface';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
    ) { 
        this.userLogger = new Logger(UserController.name);
    }
    private readonly userLogger: Logger;

    @Get()
    async findAllUsers(@Query() queryParams: UserQueryDto): Promise<UserEntity[]> {
        return this.userService.findAllUsers(queryParams);
    }

    @Get('me')
    public async findMe(@Req() req: IRequestUser) {
        if (req.username === undefined) {
            this.userLogger.error('Cannot find username for client in request body');
            throw new HttpException('user has no valid credentials', HttpStatus.BAD_REQUEST);
        }
        return await this.userService.findAllUsers({ "filter": { "username": [req.username] } });
    }

    @Get(':id')
    async findOneUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        const user = await this.userService.findOne(id);
        if (user === null) {
            this.userLogger.error('User with id ' + id + ' not found in database');
            throw new HttpException('no user in db', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /* role guards ?? */
    @Post()
    async postUser(@Body() newUser: UserDto): Promise<UserEntity> {
        if (await this.userService.findOneByUsername(newUser.username) !== null) {
            this.userLogger.error('User with id ' + newUser.username + ' already exists in database');
            throw new HttpException('User already exists',
                        HttpStatus.BAD_REQUEST);
        }
        return this.userService.postUser(newUser);
    }

    /*
    **  It can only change a user's:
    **      - photoUrl
    **      - nickname
    **      - doubleAuth (boolean)
    **      - status (ONLINE, OFFLINE, PLAYING
    */

    @Patch(':id')
    async updateUser( @Param('id', ParseIntPipe) id: number, @Body() body: Object)
                    : Promise<UpdateResult> {
        return this.userService.updateUser(id, body);
    }

    @Delete(':id')
	async remove( @Param('id', ParseIntPipe) id: number ): Promise<void> {
		return this.userService.deleteUser(id);
	}
}
