import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { BanService } from "src/ban/ban.service";
import { BanEntity } from "src/ban/entity/ban.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class Banned implements CanActivate {
    constructor (
        private readonly userService: UserService,
        private readonly banService: BanService,
    ) { }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const username = req.username;
        const roomId = (req.method === 'POST') ?
            Number(req.body['roomId']) :
            Number(req.param['room_id']);

        if (username === undefined) {
            return false;
        }
        return this.activateBan(username, roomId);
    }
    
    private async activateBan(username: string, roomId: number): Promise<boolean> {
        const user = await this.userService.findOneByUsername(username);
        if (user === undefined) {
            return false;
        }
        let isNotBanned: boolean = true;

        this.banService.findAllBans({ 
            filter: { 
                userId: [ user.id ],
                roomId: [ roomId ] 
            }
        }).then((ban: BanEntity[]) => isNotBanned = (!ban.length));
        return isNotBanned;
    }
}