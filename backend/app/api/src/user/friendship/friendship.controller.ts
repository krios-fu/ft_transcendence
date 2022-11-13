import {
    Controller,
    Get,
    Post,
    Param,
    Req,
    Patch,
    Logger
} from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { FriendshipEntity } from './friendship.entity';
import { FriendDto } from './friendship.dto';
import { UpdateResult } from 'typeorm';
import { IRequestUser } from "src/common/interfaces/request-payload.interface";

@Controller('friends')
export class    FriendshipController {
    constructor(
        private friendshipService: FriendshipService
    ) {
        this.friendlyLogger = new Logger(FriendshipController.name);
        this.friendlyLogger.log('FriendshipController inicializado');
    }
    private readonly friendlyLogger: Logger;

    @Get()
    async getFriends(@Req() req: IRequestUser): Promise<FriendDto[]> {
        return this.friendshipService.getFriends(req.username);
    }

    @Get(':id')
    async getOneFriend( @Req() req: IRequestUser, @Param('id') id: string )
                        : Promise<FriendDto> {
        return this.friendshipService.getOneFriend(req.username, id);
    }

    @Post(':id')
    async postFriend( @Req() req: IRequestUser, @Param('id') id: string )
                        : Promise<FriendshipEntity> {
        return this.friendshipService.addFriend(req.username, id);
    }

    /*
    **  Changes a friendship's status from PENDING to CONFIRMED
    **  if username of the request matches the receiverId in friendship.
    */
   
    @Patch('accept/:id')
    async acceptFriend( @Req() req: IRequestUser, @Param('id') id: string )
                        : Promise<UpdateResult> {
        return this.friendshipService.acceptFriend(req.username, id);
    }

    /*
    **  Changes a friendship's status from PENDING to REFUSED
    **  if username of the request matches the receiverId in friendship.
    */

    @Patch('refuse/:id')
    async refuseFriend( @Req() req, @Param('id') id: string )
                        : Promise<UpdateResult> {
        return this.friendshipService.refuseFriend(req.user.username, id);
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