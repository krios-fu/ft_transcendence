//export class RoomDto {
//    roomName: string;
//    password?: string;
//};

import { UsersEntity } from "src/users/users.entity";

export class RoomDto {
    roomName: string;
//    date: Date;
    users: UsersEntity[];
};