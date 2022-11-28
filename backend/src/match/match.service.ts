import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchDto } from "./match.dto";
import { MatchEntity } from "./match.entity";
import { MatchMapper } from "./match.mapper";
import { MatchRepository } from "./match.repository";

@Injectable()
export class    MatchService {
    constructor(
        @InjectRepository(MatchEntity)
        private matchRepository: MatchRepository,
        private matchMapper: MatchMapper
    ) {
        console.log("MatchService initiated.");
    }

    async findAllMatches(): Promise<MatchEntity[]> {
        return await this.matchRepository.find();
    }

    async findUserMatches(userId: string): Promise<MatchEntity[]> {
        return (await this.matchRepository.createQueryBuilder("match")
            .leftJoinAndSelect(
                "match.winner",
                "winner")
            .leftJoinAndSelect(
                "match.loser",
                "loser")
            .leftJoinAndSelect(
                "winner.user",
                "winnerUser")
            .leftJoinAndSelect(
                "loser.user",
                "loserUser")
            .select(
                [
                    "match.official",
                    "match.playedAt",
                    "winner.score",
                    "loser.score",
                    "winnerUser.nickName",
                    "loserUser.nickName",
                    "winnerUser.photoUrl",
                    "loserUser.photoUrl"
                ])
            .where(
                "winnerUser.username= :id",
                {id: userId})
            .orWhere(
                "loserUser.username= :id",
                {id: userId})
            .getMany()
        );
    }

    async findOneMatch(matchId: number): Promise<MatchEntity> {
        return await this.matchRepository.findOne({
            where: {
                id: matchId
            }
        });
    }

    /*
    **  It is only used by game gateway. Do not expose to clients.
    */
    async addMatch(matchDto: MatchDto): Promise<MatchEntity> {
        const   matchEntity: MatchEntity = this.matchMapper.toEntity(matchDto);
        
        try {
            await this.matchRepository.save(matchEntity);
        } catch (err) {
            console.log(err);
            return (null);
        }
        return (matchEntity);
    }

    async countUserMatches(userId: string): Promise<number> {
        return (await this.matchRepository.count({
            where: [
                {
                    winner: {
                        user: {
                            username: userId
                        }
                    }
                },
                {
                    loser: {
                        user: {
                            username: userId
                        }
                    }
                }
            ]
        }));
    }

}
