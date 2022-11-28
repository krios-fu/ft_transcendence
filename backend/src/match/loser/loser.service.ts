import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoserDto } from "./loser.dto";
import { LoserEntity } from "./loser.entity";
import { LoserMapper } from "./loser.mapper";
import { LoserRepository } from "./loser.repository";

@Injectable()
export class    LoserService {
    constructor(
        @InjectRepository(LoserEntity)
        private loserRepository: LoserRepository,
        private loserMapper: LoserMapper
    ) {}

    async AddLoser(loserDto: LoserDto): Promise<LoserEntity> {
        const   loserEntity: LoserEntity = new LoserEntity;

        this.loserMapper.toEntity(loserDto, loserEntity);
        try {
            this.loserRepository.insert(loserEntity);
        } catch(err) {
            console.log(err);
            return (null);
        }
        return (loserEntity);
    }
}
