import { WinnerDto } from "./winner.dto";
import { WinnerEntity } from "./winner.entity";
import { WinnerMapper } from "./winner.mapper";
import { WinnerRepository } from "./winner.repository";
export declare class WinnerService {
    private winnerRepository;
    private winnerMapper;
    constructor(winnerRepository: WinnerRepository, winnerMapper: WinnerMapper);
    AddWinner(winnerDto: WinnerDto): Promise<WinnerEntity>;
}
