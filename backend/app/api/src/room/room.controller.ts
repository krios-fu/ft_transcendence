import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RoomEntity } from "./entities/room.entity";
import { RoomService } from "./room.service";
import { UserEntity } from "src/user/user.entity";
import { RoomDto } from "./dto/room.dto";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }

    @Get()
    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomService.getAllRooms();
    }

    @Get(':room_id')
    async getRoom(@Param('room_id') room_id: string): Promise<RoomEntity> {
        return await this.roomService.findOne(room_id);
    }

    @Get(':room_id/owner/:owner_id')
    async getRoomOwner(
        @Param('room_id') room_id: string,
        @Param('owner_id') owner_id: string
    ): Promise<UserEntity> {
        return await this.roomService.getRoomOwner(room_id, owner_id)
    }

    @Put(':room_id/owner/:owner_id')
    async updateRoomOwner(
        @Param('room_id') room_id: string,
        @Param('owner_id') new_owner_id: string
    ): Promise<RoomEntity> {
        return await this.updateRoomOwner(room_id, new_owner_id);
    }

    @Post()
    async createRoom(@Body() dto: RoomDto): Promise<RoomEntity> {    
        return await this.roomService.createRoom(dto);
    }

    @Delete(':room_id')
    async removeRoom(@Param('room_id') name: string): Promise<void> {
        return await this.roomService.removeRoom(name);
    }
}