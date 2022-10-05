import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entity/room.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateBanDto } from './dto/ban.dto';
import { BanEntity } from './entity/ban.entity';
import { BanRepository } from './repository/ban.repository';

@Injectable()
export class BanService {
    constructor (
        @InjectRepository(BanEntity)
        private readonly banRepository: BanRepository,
    ) { 
        this.banLogger = new Logger(BanService.name);
    }
    private readonly banLogger: Logger;

    public async getAllBans(): Promise<BanEntity[]> {
        return await this.banRepository.find();
    }

    public async getOneBan(ban_id: number): Promise<BanEntity> {
        return await this.banRepository.findOne({
            where: {id: ban_id} 
        });
    }

    public async getBannedUsersInRoom(roomId: string): Promise<UserEntity[]> {
        let users: UserEntity[] = [];

        const bansInRoom = await this.banRepository.find({
            where: { roomId: roomId }
        });
        for (let ban of bansInRoom) {
            users.push(ban.user);
        }
        return users;
    }

    public async getRoomsWithUserBanned(userId: string): Promise<RoomEntity[]> {
        let rooms: RoomEntity[] = [];

        const bansByUser = await this.banRepository.find({
            where: { userId: userId }
        });
        for (let ban of bansByUser) {
            rooms.push(ban.room);
        }
        return rooms;
    }

    public async createBan(dto: CreateBanDto): Promise<BanEntity> {
        const newBan = new BanEntity(dto);
        try {
            await this.banRepository.save(newBan);
        } catch (err) {
            this.banLogger.error(err);
            throw new HttpException('no user or room in db', HttpStatus.BAD_REQUEST);
        }
        return newBan; /* this needs to be tested */
    }

    public async deleteBan(ban_id: number): Promise<void> {
        this.banRepository.delete(ban_id);
    }
}
