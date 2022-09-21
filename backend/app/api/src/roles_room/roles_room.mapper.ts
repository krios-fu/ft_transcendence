import { Injectable } from "@nestjs/common";
import { RolesRoomDto } from "./dto/roles_room.dto";
import { RolesRoomEntity } from "./entities/roles_room.entity";

@Injectable()
export class RolesRoomMapper {
    toEntity(): RolesRoomEntity {
        /* ... */
    }
    
    toDto(): RolesRoomDto {
        /* ... */
    }
}