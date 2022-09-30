import { BanDto } from "./dto/ban.dto";
import { BanEntity } from "./entity/ban.entity";

export class BanMapper {
    toDto(entity: BanEntity): BanDto {
        return {
            user_id: entity.user_id,
            room_id: entity.room_id,
        };
    }

    toEntity(dto: BanDto): BanEntity {
        return new BanEntity(
            dto.user_id,
            dto.room_id,
        );
    }
}