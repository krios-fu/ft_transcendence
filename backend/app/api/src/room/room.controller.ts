import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Patch, Post, Put, UseInterceptors } from "@nestjs/common";
import { RoomEntity } from "./entity/room.entity";
import { RoomService } from "./room.service";
import { UserEntity } from "src/user/user.entity";
import { CreateRoomDto } from "./dto/room.dto";
import { UserService } from "src/user/user.service";
import { UpdateResult } from "typeorm";

@Controller('room')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly userService: UserService,
    ) { 
        this.roomLogger = new Logger(RoomController.name);
    }
    private readonly roomLogger: Logger;

    /* Get all created rooms */
    @Get()
    public async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomService.getAllRooms();
    }

    /* Get a room by name */
    @Get(':room_id')
    public async getRoom(@Param('room_id') room_id: string): Promise<RoomEntity> {
        const room = await this.roomService.getRoom(room_id);
        if (room === null) {
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        return room;
    }

    /* Get owner of a room */
    @Get(':room_id/owner')
    public async getRoomOwner(@Param('room_id') room_id: string): Promise<UserEntity> {
        return await this.roomService.getRoomOwner(room_id)
    }

    /* Give a room a new owner */
    @Put(':room_id/owner/:owner_id')
    public async updateRoomOwner(
        @Param('room_id') roomId: string,
        @Param('owner_id') newOwnerId: string
    ): Promise<UpdateResult> {
        if (await this.roomService.getRoom(roomId) === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        if (await this.userService.findOne(newOwnerId) === null) {
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomService.updateRoomOwner(roomId, newOwnerId);
    }

    /* Create a new room */
    @Post()
    public async createRoom(@Body() dto: CreateRoomDto): Promise<RoomEntity> {
        const { roomId, ownerId } = dto;
        if (await this.userService.findOne(ownerId) === null) {
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        if (await this.roomService.getRoom(roomId) !== null) {
            this.roomLogger.error('room with key ' + roomId + ' already in database');
            throw new HttpException('room already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomService.createRoom(dto);
    }

    /* Update a room password ?? */
    /* UseGuards(RoomOwner) ~~ check if user owns the room ~~
       @Put(':room_id')
       public async changePwd(@Body creds: RoomPasswordDto ~~ @IsString() oldPwd, @IsString() newPwd ~~) {
         return await this.roomService.changePwd(); ~~ first checks oldPwd, then changes entity ~~
       }
    */

    /* Destroy a room */
    /* required room owner || web admin */
    @Delete(':room_id')
    public async removeRoom(@Param('room_id') name: string): Promise<void> {
        return await this.roomService.removeRoom(name);
    }
}
