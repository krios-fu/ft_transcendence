import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { RoomEntity } from 'src/room/entity/room.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateBanDto } from './dto/ban.dto';
import { BanQueryDto } from './dto/ban.query.dto';
import { BanEntity } from './entity/ban.entity';
import { BanRepository } from './repository/ban.repository';

@Injectable()
export class BanService {
    constructor (
        @InjectRepository(BanEntity)
        private readonly banRepository: BanRepository,
    ) { }

    public async findAllBans(queryParams: BanQueryDto): Promise<BanEntity[]> {
        if (queryParams !== undefined) {
            return await this.banRepository.find(new QueryMapper(queryParams));
        }
        return await this.banRepository.find();
    }

    public async findOne(ban_id: number): Promise<BanEntity> {
        return await this.banRepository.findOne({
            where: {id: ban_id} 
        });
    }

    public async getBannedUsersInRoom(roomId: number): Promise<UserEntity[]> {
        let users: UserEntity[] = [];

        const bansInRoom = await this.banRepository.find({
            where: { roomId: roomId }
        });
        for (let ban of bansInRoom) {
            users.push(ban.user);
        }
        return users;
    }

    public async getRoomsWithUserBanned(userId: number): Promise<RoomEntity[]> {
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
        return await this.banRepository.save(new BanEntity(dto));
    }

    public async deleteBan(ban_id: number): Promise<void> {
        this.banRepository.softDelete(ban_id);
    }

    public async findOneByUserRoomIds(userId: number, roomId: number) {
        return await this.banRepository.findOne({
            where: {
                userId: userId,
                roomId: roomId,
            }
        });
    }
}
