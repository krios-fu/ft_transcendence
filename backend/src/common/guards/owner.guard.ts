import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RoomEntity } from "../../room/entity/room.entity";
import { RoomService } from "../../room/room.service";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private roomService: RoomService,
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const username = req.username;
        const roomId = Number(req.body['roomId']);

        if (username === undefined || roomId !== roomId) {
            return false;
        }
        return this.validateOwner(username, roomId);
    }

    private async validateOwner(username: string, roomId: number): Promise<boolean> {
        let isOwner: boolean = false;

        this.roomService.findOne(roomId).then((room: RoomEntity) => {
            isOwner = (room.owner.username === username);
        })
        return isOwner;
    }
}