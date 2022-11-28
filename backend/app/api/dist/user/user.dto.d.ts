import { Category } from "./user.entity";
export declare class UserDto {
    username: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    email: string;
    photoUrl: string;
}
export declare type Payload = {
    userProfile: UserDto;
    accessToken: string;
};
export declare class UpdateUser {
    nickname?: string;
    email?: string;
    doubleAuth?: boolean;
    photoUrl?: string;
    ranking?: number;
    category?: Category;
}
