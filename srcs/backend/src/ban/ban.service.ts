import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { RoomEntity } from '../room/entity/room.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateBanDto } from './dto/ban.dto';
import { BanQueryDto } from './dto/ban.query.dto';
import { BanEntity } from './entity/ban.entity';
import { BanRepository } from './repository/ban.repository';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DeleteResult } from "typeorm";
import {UserRoomService} from "../user_room/user_room.service";
import {UserRoomEntity} from "../user_room/entity/user_room.entity";

@Injectable()
export class BanService {
    constructor (
        @InjectRepository(BanEntity)
        private readonly banRepository: BanRepository,
        private readonly userRoomService: UserRoomService,
        private readonly eventEmitter: EventEmitter2
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

        const bansByUser: BanEntity[] = await this.banRepository.find({
            where: { userId: userId }
        });
        for (let ban of bansByUser) {
            rooms.push(ban.room);
        }
        return rooms;
    }

    /*
    **  Además de POSTear el baneo del usuario en la sala identificados por la ID,
    **  también emitimos un evento de actualización de roles para añadir el rol de baneo a
    **  las conexiones activas del usuario, y eliminamos (si la hubiera) la entidad de usuario en sala,
    **  desuscribiendo de manera efectiva al usuario de la sala de la que ha sido baneado.
     */
    public async createBan(dto: CreateBanDto): Promise<BanEntity> {
        const ban: BanEntity = await this.banRepository.save(new BanEntity(dto));
        const { userId, roomId } = dto;
        let userRoom: UserRoomEntity;

        this.eventEmitter.emit('update.roles',
            {
                userId: dto.userId,
                roomId: dto.roomId,
                ctxName: 'banned'
            });
        userRoom = await this.userRoomService.findUserRoomIds(userId, roomId);
        if (userRoom) {
            await this.userRoomService.remove(userRoom);
        }
        return ban;
    }

    public async deleteBan(ban: BanEntity): Promise<void> {
        const { id, userId, roomId } = ban;
        const delRes: DeleteResult = await this.banRepository.delete(id);
        const roles = await this.findAllBans(undefined);
        
        if (delRes) {
            this.eventEmitter.emit('update.roles',
                {
                    userId: userId,
                    roomId: roomId,
                    ctxName: 'banned'
                });
        }
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

    public async validateBanRole(userId: number, roomId: number): Promise<boolean> {
        return ((await this.findOneByIds(userId, roomId)) !== null);
    }
}
