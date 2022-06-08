import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { PrivateRoomGuard } from "../auth/guard/private-room.guard";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./entities/room.entity";
import { RoomService } from "./room.service";
import { Public } from "src/decorators/public.decorator";
import { stringify } from "querystring";
import { IRequestUser } from "src/interfaces/request-user.interface";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }
    //@UseGuards(PrivateRoomGuard)
    //@UseGuards(BanGuard)
    @Public()
    @Post()
    async joinRoom(
       // @Req()  req: IRequestUser,
        @Body() roomCredentials: RoomDto
    ): Promise<RoomEntity> {
        const roomLogin = {
            "userName": /*req.username*/"john",
            "name": roomCredentials.name,
        };

        return await this.roomService.joinRoom(roomLogin);
    }

    @Public()
    @Post('new')
    async createRoom(
        @Req()  req: IRequestUser,
        @Body() roomCredentials: RoomDto
    ): Promise<RoomEntity> {
        const roomLogin = {
            "userName": /*req.username*/"john",
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