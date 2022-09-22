import { Injectable } from "@nestjs/common";
import { RolesEntity } from "src/roles/entities/roles.entity";
import { RoomEntity } from "src/room/entities/room.entity";
import { RolesRoomDto } from "./dto/roles_room.dto";
import { RolesRoomEntity } from "./entities/roles_room.entity";

@Injectable()
export class RolesRoomMapper {
    toEntity(roleEntity: RolesEntity, roomEntity: RoomEntity): RolesRoomEntity {
        const rolesRoomEntity = new RolesRoomEntity(roleEntity, roomEntity);
        return rolesRoomEntity;
    }
    
    toDto(rolesRoomEntity: RolesRoomEntity): RolesRoomDto {
        return {
            role_id: rolesRoomEntity.role_id,
            room_id: rolesRoomEntity.room_id,
        };
    }
}