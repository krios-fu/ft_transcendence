import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entities/room.entity';
import { UserEntity } from 'src/user/user.entity';
import { BanMapper } from './ban.mapper';
import { BanRepository } from './ban.repository';
import { BanDto } from './dto/ban.dto';
import { BanEntity } from './entity/ban.entity';

@Injectable()
export class BanService {
    constructor (
        @InjectRepository(BanEntity)
        private readonly banRepository: BanRepository,
        private readonly banMapper: BanMapper,
    ) { }

    async getAllBans(): Promise<BanEntity[]> {
        return await this.banRepository.find();
    }

    async getOneBan(ban_id: number): Promise<BanEntity> {
        return await this.banRepository.findOne({
            where: {id: ban_id} 
        });
    }

    async getBannedUsersInRoom(room_id: string): Promise<UserEntity[]> {
        let users: UserEntity[] = [];

        const bansInRoom = await this.banRepository.find({
            where: { room_id: room_id }
        });
        for (let ban of bansInRoom) {
            users.push(ban.user);
        }
        return users;
    }

    async getRoomsWithUserBanned(user_id: string): Promise<RoomEntity[]> {
        let rooms: RoomEntity[] = [];

        const bansByUser = await this.banRepository.find({
            where: { user_id: user_id }
        });
        for (let ban of bansByUser) {
            rooms.push(ban.room);
        }
        return rooms;
    }

    async createBan(dto: BanDto): Promise<BanDto> {
        const entity = this.banMapper.toEntity(dto);
        await this.banRepository.save(entity);
        return this.banMapper.toDto(entity);
    }

    async deleteBan(ban_id: number): Promise<void> {
        this.banRepository.delete(ban_id);
    }

}
