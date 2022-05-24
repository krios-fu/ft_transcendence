import { Injectable, ValidationPipe } from "@nestjs/common";
import { config } from "dotenv";
import { Profile, Strategy } from 'passport-42'
import { PassportStrategy } from '@nestjs/passport'


config();
@Injectable()
export class FortytwoStrategy extends PassportStrategy(Strategy, '42') {

		constructor(){
			super({
				clientID: process.env.FORTYTWO_APP_ID,
				clientSecret: process.env.FORTYTWO_APP_SECRET,
				callbackURL: "http://localhost:3000/auth/42/redirect",
			});
		}
		
		
		async validate (
			accesToken : string ,
			refreshToken : string,
			profile : Profile,
			done : (err : any , user : any) => void ) : Promise<any>{
			
			 const { name, emails, photos, username } = profile;
				 const user = { 
					username : username,
					firstName : name.givenName,
					lastName : name.familyName,
					email : emails[0].value,
					photo : photos[0].value,
				}; 
				const payload = {
					user,
					accesToken,
				};
				// console.log(payload);
				done(null, payload);
		}
}