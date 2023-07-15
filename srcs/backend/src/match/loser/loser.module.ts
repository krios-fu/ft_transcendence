import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoserEntity } from "./loser.entity";
import { LoserMapper } from "./loser.mapper";
import { LoserRepository } from "./loser.repository";
import { LoserService } from "./loser.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([LoserEntity])
    ],
    exports: [LoserService],
    providers: [
        LoserService,
        LoserMapper,
        LoserRepository
    ]
})
export class    LoserModule {}
