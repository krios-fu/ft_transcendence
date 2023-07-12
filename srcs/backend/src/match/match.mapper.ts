import { Injectable } from "@nestjs/common";
import { MatchDto } from "./match.dto";
import { MatchEntity } from "./match.entity";

@Injectable()
export class    MatchMapper {
    toEntity(matchDto: MatchDto): MatchEntity {
        const   matchEntity: MatchEntity = new MatchEntity();

        matchEntity.winner = matchDto.winner;
        matchEntity.loser = matchDto.loser;
        matchEntity.official = matchDto.official;
        return (matchEntity);
    }
}
