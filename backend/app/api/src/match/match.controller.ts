import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Req
} from "@nestjs/common";
import { MatchEntity } from "./match.entity";
import { MatchService } from "./match.service";

@Controller('match')
export class    MatchController {
    constructor(
        private readonly matchService: MatchService
    ) {}

    @Get()
    async getMatches(): Promise<MatchEntity[]> {
        return (await this.matchService.findAllMatches());
    }

    @Get('user')
    async getUserMatches(@Req() req): Promise<MatchEntity[]> {
        return (await this.matchService.findUserMatches(req.user.data));
    }

    //Number validation must be added
    @Get(':id')
    async getMatch(@Param('id', ParseIntPipe) id: number): Promise<MatchEntity> {
        return (await this.matchService.findOneMatch(id));
    }

    /*
    **  No PUT, POST, DELETE, or update methods for this entity.
    */
}
