import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { RoomService } from "../room.service";
export declare class PrivateRoomGuard implements CanActivate {
    private readonly roomService;
    constructor(roomService: RoomService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
