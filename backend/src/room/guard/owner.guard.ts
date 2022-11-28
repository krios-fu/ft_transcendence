import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { RoomService } from "../room.service";

//@Injectable()
//export class OwnerGuard implements CanActivate {
//    constructor(
//        private readonly roomService: RoomService,
//    ) { }
//
//    canActivate(ctxt: ExecutionContext):
//        boolean | Promise<boolean> | Observable<boolean> {
//        const req: Request = ctxt.switchToHttp().getRequest();
//
//        console.log("debugginggg: " + JSON.stringify(req.body));
//        console.log(" debugging 2: " + JSON.stringify(req.params))
//        return this.roomService.isOwner(req.body);
//    }
//}