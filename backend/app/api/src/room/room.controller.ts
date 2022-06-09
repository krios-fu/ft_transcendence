import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./entities/room.entity";
import { RoomService } from "./room.service";
import { IRequestUser } from "src/interfaces/request-user.interface";
import { PrivateRoomGuard } from "./guard/private-room.guard";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }

    @Post()
    @UseGuards(PrivateRoomGuard)
    @UseGuards(BannedGuard)
    async joinRoom(
        @Req()  req: IRequestUser,
        @Body() roomCredentials: RoomDto
    ): Promise<RoomEntity> {
        const roomLogin = {
            "userName": req.username,
            "name": roomCredentials.name,
        };

        return await this.roomService.joinRoom(roomLogin);
    }

    @Post('new')
    async createRoom(
        @Req()  req: IRequestUser,
        @Body() roomCredentials: RoomDto
    ): Promise<RoomEntity> {
        const roomLogin = {
            "userName": req.username,
            "name": roomCredentials.name,
            "password": roomCredentials.password,
        };
        
        return await this.roomService.createRoom(roomLogin);
    }

    @Get(':name')
    async getRoom(@Param() name: string): Promise<RoomEntity> {
        return await this.roomService.findOne(name);
    }

    @Get()
    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomService.getAllRooms();
    }
}