import {
    Controller,
    Get,
    Post,
    Param,
    Req,
    Delete,
} from "@nestjs/common";
import { BlockService } from "./block.service";
import { FriendshipEntity } from '../friendship/friendship.entity';
import { FriendDto } from "../friendship/friendship.dto";

@Controller('block')
export class    BlockController {
    constructor(
        private blockService: BlockService
    ) {
        console.log("BlockController inicializado");
    }

    @Get()
    async getBlockedFriends( @Req() req ) : Promise<FriendDto[]> {
        return this.blockService.getBlockedFriends(req.user.data);
    }

    /*
    **  Changes a friendship's status from CONFIRMED to BLOCKED,
    **  and adds a row in BlockEntity table.
    */

    @Post(':id')
    async blockFriend( @Req() req, @Param('id') id: string )
                        : Promise<FriendshipEntity> {
        return this.blockService.blockFriend(req.user.data, id);
    }

    /*
    **  The friendship blocker requests to unblock the friendship.
    */

    @Delete(':id')
    async unblockFriend( @Req() req, @Param('id') id: string )
                        : Promise<void> {
        return this.blockService.unblockFriend(req.user.data, id);
    }

}
