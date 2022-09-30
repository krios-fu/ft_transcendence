import { Injectable } from "@nestjs/common";
import { RolesRoomDto } from "./dto/user_room_roles.dto";
import { RolesRoomEntity } from "./entity/user_room_roles.entity";

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