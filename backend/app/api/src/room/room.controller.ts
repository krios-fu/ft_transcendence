import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { RoomEntity } from "./entity/room.entity";
import { RoomService } from "./room.service";
import { UserEntity } from "src/user/user.entity";
import { CreateRoomDto } from "./dto/room.dto";

@Controller('room')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }

    /* Get all created rooms */
    @Get()
    public async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomService.getAllRooms();
    }

    /* Get a room by name */
    @Get(':room_id')
    public async getRoom(@Param('room_id') room_id: string): Promise<RoomEntity> {
        return await this.roomService.findOne(room_id);
    }

    /* Get owner of a room */
    @Get(':room_id/owner')
    public async getRoomOwner(@Param('room_id') room_id: string): Promise<UserEntity> {
        return await this.roomService.getRoomOwner(room_id)
    }

    /* Give a room a new owner */
    @Put(':room_id/owner/:owner_id')
    public async updateRoomOwner(
        @Param('room_id') room_id: string,
        @Param('owner_id') new_owner_id: string
    ): Promise<RoomEntity> {
        return await this.updateRoomOwner(room_id, new_owner_id);
    }

    /* Create a new room */
    @Post()
    public async createRoom(@Body() dto: CreateRoomDto): Promise<RoomEntity> {    
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
