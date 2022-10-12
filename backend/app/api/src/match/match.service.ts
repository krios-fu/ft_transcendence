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
        return await this.matchRepository.find({
            relations: {
                winner: {
                    user: true
                },
                loser: {
                    user: true
                }
            },
            select: {
                winner: {
                    user: {
                        nickName: true,
                        photoUrl: true
                    }
                },
                loser: {
                    user: {
                        nickName: true,
                        photoUrl: true
                    }
                }
            },
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
            ],
            order: {
                playedAt: "DESC"
            }
        });
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
            await this.matchRepository.insert(matchEntity);
        } catch (err) {
            console.log(err);
            return (null);
        }
        return (matchEntity);
    }
}