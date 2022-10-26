import { Injectable, Logger } from "@nestjs/common";
import { RoomEntity } from "./entity/room.entity";
import { CreateRoomDto } from "./dto/room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRepository } from "./repository/room.repository";
import { UserEntity } from "src/user/user.entity";
import { UpdateResult } from "typeorm";
import { RoomQueryDto } from "./dto/room.query.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: RoomRepository,
    ) { }

    public async findAllRooms(queryParams: RoomQueryDto): Promise<RoomEntity[]> {
        if (queryParams !== undefined) {
            console.log('QUERY RECEIVED: ' + JSON.stringify(queryParams));
        }
        return await this.roomRepository.find();
    }

    public async findOne(roomId: number): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: [{ id: roomId }, { id: roomId }],
        });
    }

    public async findRoomOwner(roomId: number): Promise<UserEntity> {
        const room = this.findOne(roomId);
        return (await room).owner;
    }

    public async updateRoomOwner(roomId: number, newOwnerId: number): Promise<UpdateResult> {
        return await this.roomRepository.update(roomId, {
            ownerId: newOwnerId,
        });
    }

    public async createRoom(dto: CreateRoomDto): Promise<RoomEntity> {
        return await this.roomRepository.save(new RoomEntity(dto));
    }

    public async removeRoom(roomId: number): Promise<void> {
        await this.roomRepository.delete(roomId);
    }

    public async findOneRoomByName(name: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { roomName: name }
        });
    }

    private parseQuery(queryParams: RoomQueryDto) {
    /* filter -> where, sort -> order, range -> skip, take */
        const { filter, sort, range } = queryParams;

        

        // keys.forEach((key) => {
            // if (queryParams[key] !== undefined) {
                // if (key === 'filter') {
                    // Object.keys(queryParams['filter']).forEach((id) => {
                        // if (ids.includes(id)) {
                            // queryParams['filter'][id].split(',').forEach((value) => {
                                // const query['where'].push({id: value});
                            // });
                        // } else if (key === 'sort') {
                            // if (id keyof RoomEntity)
                        // }
                    // });
                // }
            // }
        // });

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