import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class UserGuard implements CanActivate {
    constructor () { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
    }
}