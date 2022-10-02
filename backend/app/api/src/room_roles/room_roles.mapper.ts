import { Injectable } from "@nestjs/common";
import { EntityRepository } from "typeorm";
import { RoomRolesDto } from "./dto/room_roles.dto";
import { RoomRolesEntity } from "./entity/room_roles.entity";
import { RoomRolesRepository } from "./repository/room_roles.repository";

@Injectable()
export class RoomRolesMapper {
    toDto(entity: RoomRolesEntity): RoomRolesDto {
        return {
            room: entity.room.room_id,
            role: entity.role.role,
        };
    }

    toEntity(dto: RoomRolesDto): RoomRolesEntity {
        return new RoomRolesEntity(
            dto.room,
            dto.role,
        );
    }
}