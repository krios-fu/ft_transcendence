import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WinnerDto } from "./winner.dto";
import { WinnerEntity } from "./winner.entity";
import { WinnerMapper } from "./winner.mapper";
import { WinnerRepository } from "./winner.repository";

@Injectable()
export class    WinnerService {
    constructor(
        @InjectRepository(WinnerEntity)
        private winnerRepository: WinnerRepository,
        private winnerMapper: WinnerMapper
    ) {}

    async AddWinner(winnerDto: WinnerDto): Promise<WinnerEntity> {
        const   winnerEntity: WinnerEntity = new WinnerEntity;

        this.winnerMapper.toEntity(winnerDto, winnerEntity);
        try {
            this.winnerRepository.insert(winnerEntity);
        } catch(err) {
            console.log(err);
            return (null);
        }
        return (winnerEntity);
    }
}
