import { RoleDto } from "./role.dto";
import { RoomDto } from "./room.dto";

export class RoomRoleDto {
    roomId: number;
    roleId: number;
    room: RoomDto;
    role: RoleDto;

    constructor(
        roomId: number, 
        roleId: number,
        room: RoomDto,
        role: RoleDto
    ) {
        this.roomId = roomId;
        this.roleId = roleId;
        this.room = room;
        this.role = role;
    }
}