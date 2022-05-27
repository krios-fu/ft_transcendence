/* 42 App provee de una app UID y una app SECRET,
   deberán ser introducidas a la hora de crear la estrategia (super) 
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
    constructor() {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: 'http://localhost:3000/auth/42/redirect',
        })
    }

    verify() {
    }
}
