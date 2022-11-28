import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchController } from "./match.controller";
import { MatchEntity } from "./match.entity";
import { MatchMapper } from "./match.mapper";
import { MatchRepository } from "./match.repository";
import { MatchService } from "./match.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([MatchEntity])
    ],
    exports: [MatchService],
    controllers: [MatchController],
    providers: [
        MatchService,
        MatchMapper,
        MatchRepository
    ]
})
export class    MatchModule {}
