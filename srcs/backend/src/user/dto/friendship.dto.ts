import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { UserEntity } from "../entities/user.entity";
import { FriendshipStatus } from "../enums/user.enum";

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

export class FriendshipPayload {
    @IsNumber()
    @IsNotEmpty()
    receiverId: number;
}

export class CreateFriendDto extends FriendshipPayload {
    constructor(senderId: number, payload?: FriendshipPayload) {
        super();
        this.senderId = senderId;
        if (payload !== undefined) {
            Object.assign(this, payload);
        }
    }
    @IsNumber()
    @IsNotEmpty()
    senderId: number;
}

export class BlockPayloadDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    blockReceiverId: number;
}

export class CreateBlockDto {
    @IsNumber()
    @IsNotEmpty()
    friendshipId: number;

    @IsNumber()
    @IsNotEmpty()
    blockSenderId: number;
}