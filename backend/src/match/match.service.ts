import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchQueryDto } from "./dtos/matchQuery.dto";
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

    async findAllMatches(): Promise<[MatchEntity[], number]> {
        return (await this.matchRepository.findAndCount({
            relations: {
                winner: {
                    user: true
                },
                loser: {
                    user: true
                },
            }
        }));
    }

    findUserMatches(queryParams: MatchQueryDto)
                                : Promise<[MatchEntity[], number]> {
        return (
            this.matchRepository.findAndCount({
                relations: {
                    winner: {
                        user: true
                    },
                    loser: {
                        user: true
                    },
                },
                where: [
                    {
                        winner: {
                            user: {
                                username: queryParams.username
                            }
                        }
                    },
                    {
                        loser: {
                            user: {
                                username: queryParams.username
                            }
                        }
                    }
                ],
                order: {
                    playedAt: "DESC"
                },
                skip: queryParams.offset ? queryParams.offset : undefined,
                take: queryParams.limit ? queryParams.limit : undefined
            })
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
