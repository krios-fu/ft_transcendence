import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { FriendshipStatus } from "../entities/friendship.entity";

export class    FriendDto {

    @IsString()
    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    status: FriendshipStatus;

    @IsDate()
    @IsNotEmpty()
    since: Date;

}