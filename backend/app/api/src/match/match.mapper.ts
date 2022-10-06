import { Injectable } from "@nestjs/common";
import { MatchDto } from "./match.dto";
import { MatchEntity } from "./match.entity";

@Injectable()
export class    MatchMapper {
    toEntity(matchDto: MatchDto): MatchEntity {
        const   matchEntity: MatchEntity = new MatchEntity();

        matchEntity.winnerId = matchDto.winner.username;
        matchEntity.winner = matchDto.winner;
        matchEntity.loserId = matchDto.loser.username;
        matchEntity.loser = matchDto.loser;
        matchEntity.winnerScore = matchDto.winnerScore;
        matchEntity.loserScore = matchDto.loserScore;
        matchEntity.official = matchDto.official;
        return (matchEntity);
    }
}
