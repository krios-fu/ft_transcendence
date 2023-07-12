import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query
} from "@nestjs/common";
import { MatchQueryDto } from "./dtos/matchQuery.dto";
import { MatchEntity } from "./match.entity";
import { MatchService } from "./match.service";

@Controller('match')
export class    MatchController {
    constructor(
        private readonly matchService: MatchService
    ) {}

    @Get()
    async getMatches(@Query() matchQuery: MatchQueryDto)
                        : Promise<[MatchEntity[], number]> {
        if (matchQuery.username)
            return (await this.matchService.findUserMatches(matchQuery));
        return (await this.matchService.findAllMatches());
    }

    @Get(':id')
    async getMatch(@Param('id', ParseIntPipe) id: number): Promise<MatchEntity> {
        return (await this.matchService.findOneMatch(id));
    }

    /*
    **  No PUT, POST, DELETE, or update methods for this entity.
    */
}
