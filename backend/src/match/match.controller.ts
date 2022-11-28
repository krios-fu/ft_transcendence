import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query
} from "@nestjs/common";
import { MatchEntity } from "./match.entity";
import { MatchService } from "./match.service";

@Controller('match')
export class    MatchController {
    constructor(
        private readonly matchService: MatchService
    ) {}

    @Get()
    async getUserMatches(@Query('userId') userId?: string)
            : Promise<MatchEntity[]> {
        if (userId)
            return (await this.matchService.findUserMatches(userId));
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
