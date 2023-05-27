import { Injectable, BadRequestException } from "@nestjs/common";
import { RoomEntity } from "./entity/room.entity";
import { CreatePrivateRoomDto, UpdateRoomDto, UpdateRoomOwnerDto } from "./dto/room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRepository } from "./repository/room.repository";
import { RoomQueryDto } from "./dto/room.query.dto";
import { QueryMapper } from "../common/mappers/query.mapper";
import { UserEntity } from "../user/entities/user.entity";
import * as fs from 'fs';
import { UserService } from "src/user/services/user.service";
import {UserRoomEntity} from "../user_room/entity/user_room.entity";
import { DEFAULT_AVATAR_PATH } from "src/common/config/upload-avatar.config";
import { DataSource, InsertResult, QueryRunner, SelectQueryBuilder } from "typeorm";
import { RoomRolesEntity } from "src/room_roles/entity/room_roles.entity";
import { RolesEntity } from "src/roles/entity/roles.entity";
import { RoomUserCountQueryDto } from "./dto/room-user-count.query.dto";
import { RoomQueryMapper } from "./mappers/roomQuery.mapper";


class RoomDto {
    roomName: string;
    ownerId: number;
}

class PrivateRoomDto extends RoomDto {
    password: string;
}

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: RoomRepository,
        private readonly userService: UserService,
        private readonly dataSource: DataSource
    ) { }

    public async findAllRooms(queryParams: RoomQueryDto): Promise<RoomEntity[]> {
        if (queryParams !== undefined) {
            return await this.roomRepository.find(new QueryMapper(queryParams));
        }
        return await this.roomRepository.find();
    }

    public async findAndCountAllRooms(queryParams: RoomQueryDto): Promise<[RoomEntity[], number]> {
        if (queryParams !== undefined) {
            return await this.roomRepository.findAndCount(new RoomQueryMapper(queryParams))
        }
        return await this.roomRepository.findAndCount();
    }

    public async findAllRoomsUserCount(queryParams: RoomUserCountQueryDto): Promise<[RoomEntity[], number]> {
        const   dbQuery: SelectQueryBuilder<RoomEntity> =
                        this.roomRepository.createQueryBuilder('room')
                        .leftJoin('room.userRoom', 'userRoom')
                        .leftJoin('room.roomRole', 'roomRole')
                        .leftJoin('roomRole.role', 'role')
                        .loadRelationCountAndMap('room.userCount', 'room.userRoom')
                        .select(['room.id']);
        
        if (queryParams.roleName)
        {
            if (queryParams.roleName === 'public')
                dbQuery.where('role.role != :roleName OR role IS NULL', { roleName: 'private' });
            else
                dbQuery.where('role.role = :roleName', { roleName: queryParams.roleName });
        }
        if (queryParams.order
                && queryParams.order.length)
        {
            for (const orderVal of queryParams.order)
            {
                dbQuery.orderBy('room.' + orderVal);
            }
        }
        if (queryParams.limit)
            dbQuery.limit(queryParams.limit);
        if (queryParams.offset)
            dbQuery.offset(queryParams.offset);
        return (await dbQuery.getManyAndCount());
    }

    public async findOne(roomId: number): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { id: roomId },
        });
    }

    public async findByName(roomName: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { roomName: roomName }
        });
    }

    public async findRoomOwner(roomId: number): Promise<UserEntity> {
        const room: RoomEntity = await this.findOne(roomId);

        if (room == null) {
            return null;
        }
        return room.owner;
    }

    public async updateRoom(roomId: number, dto: UpdateRoomDto | UpdateRoomOwnerDto): Promise<RoomEntity> {
        await this.roomRepository.update(roomId, dto);
        return await this.findOne(roomId);
    }

    public async createRoom(dto: RoomDto): Promise<RoomEntity> {
        const roomEntity: RoomEntity = new RoomEntity(dto);
        const room: RoomEntity | null = await this.roomRepository.save(roomEntity);

        if (room === null) {
            return room;
        }
        const { ownerId, id } = room;
        const userRoom: UserRoomEntity = new UserRoomEntity({ userId: ownerId, roomId: id });

        room.userRoom = [userRoom];
        return await this.roomRepository.save(room);
    }

    public async createPrivateRoom(dto: PrivateRoomDto): Promise<RoomEntity> {
        const { roomName, ownerId, password } = dto;
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        let roomId: number;
        try {
            const room: InsertResult = (await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(RoomEntity)
                .values([
                    { 
                        roomName: roomName, 
                        ownerId: ownerId
                    }
                ])
                .execute());
            roomId = room['identifiers'][0]['id'];
            const privateRoleId: number = (await queryRunner.manager
                .createQueryBuilder(RolesEntity, 'roles')
                .where('roles.role = :role_name', { role_name: 'private' })
                .getOne())
            ['id'];
            const role: RoomRolesEntity = new RoomRolesEntity({
                'roomId': roomId,
                'roleId': privateRoleId,
                'password': password
            });
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(RoomRolesEntity)
                .values(role)
                .execute();
            const userRoom: UserRoomEntity = new UserRoomEntity({ 
                userId: ownerId, 
                roomId: roomId
            });
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(UserRoomEntity)
                .values(userRoom)
                .execute();
            await queryRunner.commitTransaction();
        } catch(err) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException();
        } finally {
            await queryRunner.release();
        }
        return await this.findOne(roomId);
    }

    public async removeRoom(room: RoomEntity): Promise<void> {
        const { id, photoUrl } = room;
        if (photoUrl !== null) {
            fs.unlinkSync(photoUrl);
        }
        await this.roomRepository.delete(id);
    }

    public async findOneRoomByName(name: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { roomName: name }
        });
    }

    public async removeRoomAvatar(roomId: number, photoUrl: string): Promise<RoomEntity> {
        fs.unlinkSync(photoUrl);
        await this.updateRoom(roomId, { photoUrl: DEFAULT_AVATAR_PATH });
        return this.findOne(roomId);
    }

    public async getRoomsOwnedByUser(userId: number): Promise<RoomEntity[]> {
        return (await this.roomRepository.createQueryBuilder('room'))
            .leftJoinAndSelect(
                'room.owner',
                'user',
                'room.owner_id = :user_id',
                { 'user_id': userId }
            )
            .getMany();
    }

    public async updateRoomOwner(ownerId: number, roomId: number): Promise<RoomEntity> {
        const users: UserEntity[] = (await this.userService.getAdminsInRoom(roomId))
            .filter((user: UserEntity) => user['id'] != ownerId);

        if (users.length === 0) {
            throw new BadRequestException('owner must chose and administrator first');
        }
        const newOwnerId: number = users[0].id;
        await this.updateRoom(roomId, { ownerId: newOwnerId });
        return await this.findOne(roomId);
    }

    public async isUserInRoom(userId: number, roomId: number): Promise<boolean> {
        const room: RoomEntity = await (this.roomRepository.createQueryBuilder('room'))
            .leftJoinAndSelect(
                'room.userRoom',
                'user_room',
                'user_room.user_id = :user_id',
                { 'user_id': userId }
            )
            .where('id = :room_id', { 'room_id': roomId })
            .getOne();
            return (room !== null);
    }

    public async validateAdmin(userId: number, roomId: number): Promise<boolean> {
        const admins: UserEntity[] = await this.userService.getAdminsInRoom(roomId);

        return (admins.filter(user => user['id'] == userId)).length > 0;
    }

    ///**************** room auth services *****************/
    //public async loginToRoom(loginInfo: LoginInfoDto): Promise<boolean> {
    //    const roomEntity = await this.roomRepository.findOne({
    //        where: {
    //            name: loginInfo.name
    //        }
    //    });
//
    //    if (roomEntity === null) {
    //        throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
    //    }
    //    if (roomEntity.password === null) {
    //        return true;
    //    }
    //    if (loginInfo.password === undefined) {
    //        return false;
    //    }
    //    return await bcrypt.compare(loginInfo.password, roomEntity.password);
    //}
//
    //public async isOwner(loginInfo: LoginInfoDto): Promise<boolean> {
    //    const ownerRoom: RoomEntity = await this.roomRepository.findOne({
    //        relations: { owner: true },
    //        where: { 
    //            name: loginInfo.name,
    //            owner: loginInfo.user, /* ??? */
    //        }
    //    });
//
    //    return (ownerRoom != null);
    //}
//
    //public async getUserRole(user: string, room: string): Promise<Roles> {
    //    const roleArray = await this.rolesRepository.find({
    //        select: ["role"],
    //        where: {
    //            role_user: user,
    //            role_room: room,
    //        }
    //    });
    //    if (roleArray.length === 0) {
    //        return Roles.NOT_IN_ROOM;
    //    }
    //    return roleArray[0].role;
    //}
//
    //public async authRole(userRoleCreds: RoleInfoDto, allowedRole: Roles): Promise<boolean> {
    //    const { user, room } = userRoleCreds;
//
    //    if (user === undefined || room === undefined) { // ???
    //        return false;
    //    }
    //    const userRole = await this.getUserRole(user, room);
//
    //    return (userRole >= allowedRole);
    //}
    /**************** ****************** *****************/
}
