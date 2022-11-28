import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UpdateUser, UserDto } from './user.dto';
import { UpdateResult } from 'typeorm';
import { Public } from 'src/decorators/public.decorator';
import { ChatService } from 'src/chat/chat.service';
import { ChatEntity } from 'src/chat/entities/chat.entity';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private chatService: ChatService,
    ) {
        console.log("UserController inicializado");
    }

    @Get()
    async findAllUsers(): Promise<UserEntity[]> {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    // @Public()
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @Get(':id/chat')
    // @Public()
   async findChats(@Param('id') id: string) {
        return await this.chatService.findChatsUser(id);
   }

   @Get(':id/chat/:id_friend')
//    @Public()
  async findChat(@Param('id') id: string, @Param('id_friend') id_friend: string) {
    return  await this.chatService.findChatUser(id, id_friend);
    
  }

    @Public()
    @Post('new')
    async postUser(@Body() newUser: UserDto): Promise<UserEntity> {
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
    async updateUser( @Param('id') id: string, @Body() body: UpdateUser)
                    : Promise<UpdateResult> {
        return this.userService.updateUser(id, body);
    }

    @Delete(':id')
	async remove( @Param('id') id: string ): Promise<void> {
		return this.userService.deleteUser(id);
	}

}
