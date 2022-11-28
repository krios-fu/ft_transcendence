
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: 'http://localhost:4200/home',
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        callback: (err: any, payload: any) => void,
    ): Promise<any> {
        const { username, name, profileUrl, emails, _json } = profile;
        console.log("payload --->", _json.image.link);
        const userProfile: CreateUserDto = {
            username: username,
            firstName: name.givenName,
            lastName: name.familyName,
            profileUrl: profileUrl,
            email: emails[0].value,
            photoUrl: _json.image.link,
        };
        
        callback(null, userProfile);
    }
}
