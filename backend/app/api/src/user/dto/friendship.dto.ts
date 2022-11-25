import { IsDate, IsEnum, IsNotEmpty, IsObject } from "class-validator";
import { FriendshipStatus } from "../entities/friendship.entity";
import { UserEntity } from "../entities/user.entity";

export class    FriendDto {
    @IsObject()
    @IsNotEmpty()
    user: UserEntity;

    @IsEnum(FriendshipStatus)
    @IsNotEmpty()
    status: FriendshipStatus;

    @IsDate()
    @IsNotEmpty()
    since: Date;
}