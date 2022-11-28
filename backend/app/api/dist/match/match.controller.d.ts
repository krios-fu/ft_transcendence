import { MatchEntity } from "./match.entity";
import { MatchService } from "./match.service";
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    getUserMatches(userId?: string): Promise<MatchEntity[]>;
    getMatch(id: number): Promise<MatchEntity>;
}
