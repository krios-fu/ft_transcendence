import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RoomService } from "../room.service";

@Injectable()
export class PrivateRoomGuard implements CanActivate {
    constructor (
        private readonly roomService: RoomService
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        //console.log(request);
        return this.roomService.loginToRoom(request.body);
    }
}