import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { RoomDto } from "./dto/room.dto";
import { RoomEntity } from "./entities/room.entity";
import { RoomService } from "./room.service";
import { IRequestPayload } from "src/interfaces/request-payload.interface";
import { LoginInfoDto } from "./dto/login-info.dto";
import { UserEntity } from "src/user/user.entity";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }

    @Post()
    async joinRoom(@Body() loginInfo: LoginInfoDto): Promise<RoomEntity> {
        return await this.roomService.joinRoom(loginInfo);
    }

    @Post('new')
    async createRoom(
        @Req()  req: IRequestPayload,
        @Body() roomDto: RoomDto,
    ): Promise<RoomEntity> {
        const roomLogin: LoginInfoDto = {
            "user": req.jwtPayload.data.username,
            "name": roomDto.name,
            "password": roomDto.password,
        };
        
        return await this.roomService.createRoom(roomLogin);
    }

    @Get()
    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomService.getAllRooms();
    }

    @Get(':name')
    async getRoom(@Param() name: string): Promise<RoomEntity> {
        return await this.roomService.findOne(name);
    }

    @Get(':room_id/users')
    async getRoomUsers(@Param('room_id') room_id: string): Promise<UserEntity[]> {
        return await this.roomService.getRoomUsers(room_id);
    }

    @Delete(':room_id')
    async removeRoom(@Param('room_id') name: string): Promise<void> {
        return await this.roomService.removeRoom(name);
    }
}