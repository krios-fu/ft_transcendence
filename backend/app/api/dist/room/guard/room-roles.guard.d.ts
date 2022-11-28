import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoomService } from '../room.service';
export declare class RoomRolesGuard implements CanActivate {
    private reflector;
    private readonly roomService;
    constructor(reflector: Reflector, roomService: RoomService);
    canActivate(ctxt: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
