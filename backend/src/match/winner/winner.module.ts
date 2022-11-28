import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinnerEntity } from "./winner.entity";
import { WinnerMapper } from "./winner.mapper";
import { WinnerRepository } from "./winner.repository";
import { WinnerService } from "./winner.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([WinnerEntity])
    ],
    exports: [WinnerService],
    providers: [
        WinnerService,
        WinnerMapper,
        WinnerRepository
    ]
})
export class    WinnerModule {}
