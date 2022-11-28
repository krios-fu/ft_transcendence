import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class MeGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
    ) { }
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const username = req.username;
        const userId = (req.method === 'POST') ?
            Number(req.body['id']) :
            Number(req.param['id']);
        
        if (username === undefined || userId !== userId) {
            return false;
        }
        return this.validateMe(username, userId);
    }

    private async validateMe(username: string, userId: number): Promise<boolean> {
        let me: boolean = false;

        this.userService.findOne(userId).then((user) => {
            me = (user.username === username);
        });
        return me;
    }
}