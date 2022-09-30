import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async create(dto: RoomRolesDto): Promise<RoomRolesEntity> {

    return await this.roomRolesRepository.save(/* entity */);
  }

  async findAll(): Promise<RoomRolesEntity[]> {
    return await this.roomRolesRepository.find();
  }

  async findOne(id: number) {
    return await this.roomRolesRepository.findOne(id);
  }

  async findRoleRoom() {

  }

  async updateRoomRole() {
    
  }

  async remove(id: number): Promise<void> {
    await this.roomRolesRepository.delete(id);
  }
}
