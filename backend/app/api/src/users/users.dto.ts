export class UsersDto {
    username: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    email: string;
    photoUrl: string;
}

export type Payload = {
    userProfile: UsersDto;
    accessToken: string;
};
