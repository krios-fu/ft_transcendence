import { Injectable } from "@nestjs/common";
import { RolesRoomDto } from "./dto/roles_room.dto";
import { RolesRoomEntity } from "./entities/roles_room.entity";

@Injectable()
export class RolesRoomMapper {
    toEntity(dto: RolesRoomDto): RolesRoomEntity {
        const { user_room_id, role_id } = dto;
        return new RolesRoomEntity(
            user_room_id,
            role_id,
        );
    }

    toDto(entity: RolesRoomEntity): RolesRoomDto {
        return {
            user_room_id: entity.user_room_id,
            role_id: entity.role_id,
        };
    }
}