import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { RoomEntity } from '../room/entity/room.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateBanDto } from './dto/ban.dto';
import { BanQueryDto } from './dto/ban.query.dto';
import { BanEntity } from './entity/ban.entity';
import { BanRepository } from './repository/ban.repository';
import { SocketHelper } from 'src/game/game.socket.helper';

@Injectable()
export class BanService {
    constructor (
        @InjectRepository(BanEntity)
        private readonly banRepository: BanRepository,
        private readonly socketService: SocketHelper
    ) { }

    public async findAllBans(queryParams: BanQueryDto): Promise<BanEntity[]> {
        if (queryParams !== undefined) {
            return await this.banRepository.find(new QueryMapper(queryParams));
        }
        return await this.banRepository.find();
    }

    public async findOne(banId: number): Promise<BanEntity> {
        return await this.banRepository.findOne({
            where: {id: banId} 
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
        const ban: BanEntity = await this.banRepository.save(new BanEntity(dto));

        await this.socketService.refreshUserRoles(dto, 'banned');
        return ban;
    }

    public async deleteBan(banId: number): Promise<void> {
        await this.banRepository.delete(banId);
        //await this.socketService.refreshUserRoles(dto, 'banned');
    }

    public async findOneByIds(
        userId: number, 
        roomId: number
    ): Promise<BanEntity> {
        return await this.banRepository.findOne({
            where: {
                userId: userId,
                roomId: roomId,
            }
        });
    }

    public async findOneByNames(
        username: string,
        room: string
    ): Promise<BanEntity[]> {
        return await this.banRepository.find({
            relations: {
                user: true,
                room: true
            }, where: {
                user: { username: username },
                room: { roomName: room }
            }
        });
    }
}
