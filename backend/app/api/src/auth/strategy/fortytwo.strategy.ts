import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import * as bcrypt from 'bcrypt';

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
        callback: (err: any, payload: any) => void,
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
        /* encrypt payload */

        callback(null, payload);
    }
}
