import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';

/* private-room strategy 
 * 
 *
 */

/*@Injectable()
export class PrivateRoomStrategy extends PassportStrategy(Strategy, "private-room") {
    constructor() {
        super();
    }

    async validate()
}*/