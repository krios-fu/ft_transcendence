import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { RoomDto } from "./dto/room.dto";
import { RoomEntity } from "./entities/room.entity";
import { RoomService } from "./room.service";
import { IRequestPayload } from "src/interfaces/request-payload.interface";
import { PrivateRoomGuard } from "./guard/private-room.guard";
import { Roles } from "./roles.enum";
import { RoomRolesGuard } from "./guard/room-roles.guard";
import { MinRoleAllowed } from "src/decorators/roles.decorator";
import { LoginInfoDto } from "./dto/login-info.dto";
import { OwnerGuard } from "./guard/owner.guard";
import { UserEntity } from "src/user/user.entity";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) { }

    @Post()
    @MinRoleAllowed(Roles.NOT_IN_ROOM)
    @UseGuards(PrivateRoomGuard)
    @UseGuards(RoomRolesGuard)
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

    @Get(':name/users')
    async getRoomUsers(@Param() name: string): Promise<UserEntity[]> {
        return await this.roomService.getRoomUsers(name);
    }

    @UseGuards(OwnerGuard)
    @Delete(':name/remove')
    async removeRoom(@Param() name: string): Promise<void> {
        return await this.roomService.removeRoom(name);
    }

    @MinRoleAllowed(Roles.MOD)
    @UseGuards(RoomRolesGuard)
    @Post()
    async muteUser() {
    
    }

    @Post()
    async unmuteUser() {

    }

    @UseGuards(OwnerGuard)
    @Post()
    async makeUserMod() {

    }
}