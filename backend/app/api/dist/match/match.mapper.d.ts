import { MatchDto } from "./match.dto";
import { MatchEntity } from "./match.entity";
export declare class MatchMapper {
    toEntity(matchDto: MatchDto): MatchEntity;
}
