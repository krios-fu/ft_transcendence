import {
    Controller,
    Get,
    Post,
    Param,
    Req,
    Patch
} from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { FriendshipEntity } from './friendship.entity';
import { FriendDto } from './friendship.dto';
import { UpdateResult } from 'typeorm';

@Controller('friends')
export class    FriendshipController {
    constructor(
        private friendshipService: FriendshipService
    ) {
        console.log("FriendshipController inicializado");
    }

    @Get()
    async getFriends(@Req() req): Promise<FriendDto[]> {
        return this.friendshipService.getFriends(req.user.data);
    }

    @Get(':id')
    async getOneFriend( @Req() req, @Param('id') id: string )
                        : Promise<FriendDto> {
        return this.friendshipService.getOneFriend(req.user.data, id);
    }

    @Post(':id')
    async postFriend( @Req() req, @Param('id') id: string )
                        : Promise<FriendshipEntity> {
        return this.friendshipService.addFriend(req.user.data, id);
    }

    /*
    **  Changes a friendship's status from PENDING to CONFIRMED
    **  if username of the request matches the receiverId in friendship.
    */
   
    @Patch('accept/:id')
    async acceptFriend( @Req() req, @Param('id') id: string )
                        : Promise<UpdateResult> {
        return this.friendshipService.acceptFriend(req.user.data, id);
    }

    /*
    **  Changes a friendship's status from PENDING to REFUSED
    **  if username of the request matches the receiverId in friendship.
    */

    @Patch('refuse/:id')
    async refuseFriend( @Req() req, @Param('id') id: string )
                        : Promise<UpdateResult> {
        return this.friendshipService.refuseFriend(req.user.data, id);
    }

    /*
    **  IMPORTANT!
    **
    **  A Friendship is deleted only when at least one of the two users'
    **  account is deleted. No matter the status of the friendship.
    **
    **  Therefore, no @Delete route for /users/friends is provided.
    */

}
