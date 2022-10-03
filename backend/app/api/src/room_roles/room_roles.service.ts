import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { CreateRoomRolesDto, UpdateRoomRolesDto } from './dto/room_roles.dto';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { RoomRolesRepository } from './repository/room_roles.repository';

@Injectable()
export class RoomRolesService {
  constructor(
    @InjectRepository(RoomRolesEntity)
    private readonly roomRolesRepository: RoomRolesRepository,
  ) { }

  public async create(dto: CreateRoomRolesDto): Promise<RoomRolesEntity> {
    const newRoomRole = new RoomRolesEntity(dto);
    return await this.roomRolesRepository.save(newRoomRole);
  }

  public async findAll(): Promise<RoomRolesEntity[]> {
    return await this.roomRolesRepository.find();
  }

  public async findOne(id: number) {
    return await this.roomRolesRepository.findOne({
      where: { id: id }
    });
  }

  public async findRoleRoom(roomId: string): Promise<RolesEntity> {
    const roomRole = await this.roomRolesRepository.findOne({
      relations: { 
        room: true,
        role: true,
      },
      where: { 
        room: { room_id: roomId }
      }
    });
    return roomRole.role;
  }

  public async updateRoomRole(id: number, dto: UpdateRoomRolesDto): Promise<RoomRolesEntity> {
    await this.roomRolesRepository.update(id, dto);
    return await this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    await this.roomRolesRepository.delete(id);
  }
}
