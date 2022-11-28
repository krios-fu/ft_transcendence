import { UserEntity } from "src/user/user.entity";
import { Roles } from "../roles.enum";
import { RoomEntity } from "./room.entity";
export declare class RolesEntity {
    role_user: string;
    user: UserEntity;
    role_room: string;
    room: RoomEntity;
    role: Roles;
    silencedDate: Date;
    constructor(user: UserEntity, room: RoomEntity, role?: Roles, date?: Date);
}
