import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { RoomService } from 'src/room/room.service';
import { RolesRoomDto } from './dto/roles_room.dto';
import { RolesRoomEntity } from './entities/roles_room.entity';
import { RolesRoomRepository } from './repositories/roles_room.repository';
import { RolesRoomMapper } from './roles_room.mapper';

@Injectable()
export class RolesRoomService {
    constructor(
        @InjectRepository(RolesRoomEntity)
        private readonly rolesRoomRepository: RolesRoomRepository,
        private readonly rolesRoomMapper: RolesRoomMapper,
        private readonly roomService: RoomService,
        private readonly rolesService: RolesService,
    ) { }

    async getRole(id: number) { 

    }

    async getRolesFromRoom(room_id: string): Promise<RolesRoomEntity[]> {
        const roomEntity = this.roomService.findOne(room_id);
        return await this.rolesRoomRepository.find({
            relations: {
                role: true,
                room: true,
            },
            where: { room_id: room_id }
        });
    }

    async postRoleInRoom(newRoleRoom: RolesRoomDto): Promise<RolesRoomEntity> { 
        const { role_id, room_id } = newRoleRoom;
        const roleEntity = await this.rolesService.findOne(role_id);
        if (roleEntity === null) {
            throw new HttpException('no role in db', HttpStatus.BAD_REQUEST);
        }
        const roomEntity = await this.roomService.findOne(room_id);
        if (roomEntity === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        const roleRoomEntity = this.rolesRoomMapper.toEntity(roleEntity, roomEntity);
        return await this.rolesRoomRepository.save(roleRoomEntity);
    }
}
