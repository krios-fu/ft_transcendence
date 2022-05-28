/* 42 App provee de una app UID y una app SECRET,
   deberán ser introducidas a la hora de crear la estrategia (super) 
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { Payload } from '../users/users.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
    constructor() {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: 'http://localhost:3000/auth/42/redirect',
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        callback: (err: any, payload: Payload) => void,
    ): Promise<any> {
        const { username, name, profileUrl, emails, photos } = profile;
        const userProfile = {
            username: username,
            firstName: name.givenName,
            lastName: name.familyName,
            profileUrl: profileUrl,
            email: emails[0].value,
            photoUrl: photos[0].value,
        };
        const payload = {
            userProfile,
            accessToken,
        };

        console.log("42-passport strategy: " + JSON.stringify(payload));
        callback(null, payload);
    }
}
