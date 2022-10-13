import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { CreateRoomRolesDto, UpdateRoomRolesDto } from './dto/room_roles.dto';
import { RoomRolesQueryDto } from './dto/room_roles.query.dto';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { RoomRolesRepository } from './repository/room_roles.repository';

@Injectable()
export class RoomRolesService {
    constructor(
        @InjectRepository(RoomRolesEntity)
        private readonly roomRolesRepository: RoomRolesRepository,
    ) { }

    public async findAll(queryParams: RoomRolesQueryDto): Promise<RoomRolesEntity[]> {
        return await this.roomRolesRepository.find(/* ??? */);
    }

    public async findOne(id: number) {
        return await this.roomRolesRepository.findOne({
            where: { id: id }
        });
    }

    public async findRoleRoom(roomId: number): Promise<RolesEntity> {
        const roomRole = await this.roomRolesRepository.findOne({
            relations: { 
                room: true,
                role: true,
            },
            where: { 
                room: { id: roomId }
            }
        });
        if (roomRole === null) {
            return null;
        }
        return roomRole.role;
    }

    public async create(dto: CreateRoomRolesDto): Promise<RoomRolesEntity> {
        const newRoomRole = new RoomRolesEntity(dto);
        return await this.roomRolesRepository.save(newRoomRole);
    }

    public async updateRoomRole(id: number, dto: UpdateRoomRolesDto): Promise<RoomRolesEntity> {
        await this.roomRolesRepository.update(id, dto);
        return await this.findOne(id);
    }

    public async remove(id: number): Promise<void> {
        await this.roomRolesRepository.delete(id);
    }

    /* ~~ role identifying service ~~ */

    public async isRole(roleToCheck: string, roomId: number): Promise<boolean> {
        const role = await this.findRoleRoom(roomId);
        if (role === null) {
            return false;
        }
        return (role.role === roleToCheck);
    }
}
