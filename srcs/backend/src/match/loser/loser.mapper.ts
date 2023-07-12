import { Injectable } from "@nestjs/common";
import { LoserDto } from "./loser.dto";
import { LoserEntity } from "./loser.entity";

@Injectable()
export class    LoserMapper {
    toEntity(loserDto: LoserDto, loserEntity: LoserEntity) {
        loserEntity.user = loserDto.user;
        loserEntity.ranking = loserDto.ranking;
        loserEntity.category = loserDto.category;
        loserEntity.score = loserDto.score;
    }
}
