import { Injectable } from "@nestjs/common";
import { LoserDto } from "./loser.dto";
import { LoserEntity } from "./loser.entity";

@Injectable()
export class    LoserMapper {
    toEntity(winnerDto: LoserDto, winnerEntity: LoserEntity) {
        winnerEntity.user = winnerDto.user;
        winnerEntity.score = winnerDto.score;
    }
}
