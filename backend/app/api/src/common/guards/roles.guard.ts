import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class RolesGuard implements CanActivate {
    canActivate(
        ctx: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        /* need context from decorated function */
        /* need context from request (user credentials) */
        /* need access to user roles repository */

    }
}