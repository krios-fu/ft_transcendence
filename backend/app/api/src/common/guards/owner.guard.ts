import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RoomService } from "src/room/room.service";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { IRequestUser } from "../interfaces/request-payload.interface";


@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private roomService: RoomService,
    ) { }
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
    }

    async validateOwner(req: IRequestUser): boolean | Promise<boolean> {
        req.body
        if (req.username === undefined) {
            return false;
        }
        var isOwner: boolean = false;
        })
    }
}