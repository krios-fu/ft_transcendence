import { LoserDto } from "./loser.dto";
import { LoserEntity } from "./loser.entity";
import { LoserMapper } from "./loser.mapper";
import { LoserRepository } from "./loser.repository";
export declare class LoserService {
    private loserRepository;
    private loserMapper;
    constructor(loserRepository: LoserRepository, loserMapper: LoserMapper);
    AddLoser(loserDto: LoserDto): Promise<LoserEntity>;
}
