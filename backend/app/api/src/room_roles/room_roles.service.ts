import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomRolesDto } from './dto/room_roles.dto';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { RoomRolesRepository } from './repository/room_roles.repository';
import { RoomRolesMapper } from './room_roles.mapper';

@Injectable()
export class RoomRolesService {
  constructor(
    @InjectRepository(RoomRolesEntity)
    private readonly roomRolesRepository: RoomRolesRepository,
    private readonly roomRolesMapper: RoomRolesMapper,
  ) { }

  public async create(dto: RoomRolesDto): Promise<RoomRolesEntity> {
    const entity = this.roomRolesMapper.toEntity(dto);
    return await this.roomRolesRepository.save(entity);
  }

  public async findAll(): Promise<RoomRolesEntity[]> {
    return await this.roomRolesRepository.find();
  }

  public async findOne(id: number) {
    return await this.roomRolesRepository.findOne(id);
  }

  public async findRoleRoom(roomId: string): Promise<RolesEntity> {
    const roleRoom = await this.roomRolesRepository.find({
      relations: { 
        room: true,
        role: true,
      },
      where: { 
        room: { room_id: roomId }
      }
    });
    return roleRoom.role;
  }

  public async updateRoomRole(id: number, entity: /* no */): Promise<RoomRolesEntity> {
    return await this.roomRolesRepository.update(id, entity)
  }

  public async remove(id: number): Promise<void> {
    await this.roomRolesRepository.delete(id);
  }
}
