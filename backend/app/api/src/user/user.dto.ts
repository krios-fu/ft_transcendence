export class UserDto {

    username: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    email: string;
    photoUrl: string;
    friends?: UserDto[];

}

export type Payload = {

    userProfile: UserDto;
    accessToken: string;

};
