import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { RequestWithPayload } from "src/auth/auth.controller";
import { PrivateRoomGuard } from "../auth/guard/private-room.guard";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./entities/room.entity";
import { RoomService } from "./room.service";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }
    //@UseGuards(PrivateRoomGuard)
    //@UseGuards(BanGuard)
    @Post()
    async joinRoom(
        @Req()  req: RequestWithPayload,
        @Body() roomCredentials: RoomDto
    ): Promise<RoomEntity> {
        const roomLogin = {
            "userName": req.user.userProfile.username,
            "name": roomCredentials.name,
        };

        return await this.roomService.joinRoom(roomLogin);
    }

    @Post('new')
    async createRoom(
        @Req()  req: RequestWithPayload,
        @Body() roomCredentials: RoomDto
    ): Promise<RoomEntity> {
        const roomLogin = {
            "userName":   req.user.userProfile.username,
            "name":   roomCredentials.name,
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