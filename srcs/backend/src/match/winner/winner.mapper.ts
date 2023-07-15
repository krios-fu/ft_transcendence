import { Injectable } from "@nestjs/common";
import { WinnerDto } from "./winner.dto";
import { WinnerEntity } from "./winner.entity";

@Injectable()
export class    WinnerMapper {
    toEntity(winnerDto: WinnerDto, winnerEntity: WinnerEntity) {
        winnerEntity.user = winnerDto.user;
        winnerEntity.ranking = winnerDto.ranking;
        winnerEntity.category = winnerDto.category;
        winnerEntity.score = winnerDto.score;
    }
}
