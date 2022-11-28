import { MatchDto } from "./match.dto";
import { MatchEntity } from "./match.entity";
import { MatchMapper } from "./match.mapper";
import { MatchRepository } from "./match.repository";
export declare class MatchService {
    private matchRepository;
    private matchMapper;
    constructor(matchRepository: MatchRepository, matchMapper: MatchMapper);
    findAllMatches(): Promise<MatchEntity[]>;
    findUserMatches(userId: string): Promise<MatchEntity[]>;
    findOneMatch(matchId: number): Promise<MatchEntity>;
    addMatch(matchDto: MatchDto): Promise<MatchEntity>;
    countUserMatches(userId: string): Promise<number>;
}
