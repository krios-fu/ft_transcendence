import {
    Controller,
    Get,
    Post,
    Param,
    Req,
} from "@nestjs/common";
import { BlockService } from "./block.service";
import { FriendshipEntity } from '../friendship/friendship.entity';

@Controller('block')
export class    BlockController {
    constructor(
        private blockService: BlockService
    ) {
        console.log("BlockController inicializado");
    }

    @Get()
    async getBlockedFriends( @Req() req ) : Promise<FriendshipEntity[]> {
        console.log("Hi")
        return this.blockService.getBlockedFriends(req.user.data);
    }

    /*
    **  Changes a friendship's status from CONFIRMED to BLOCKED,
    **  and adds a row in BlockEntity table.
    */

    @Post('block/:id')
    async blockFriend( @Req() req, @Param('id') id: string )
                        : Promise<FriendshipEntity> {
        return this.blockService.blockFriend(req.user.data, id);
    }

}
