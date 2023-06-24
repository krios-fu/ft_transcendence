import { RoomEntity } from "./entity/room.entity";
import { RoomService } from "./room.service";
import { UserEntity } from "../user/entities/user.entity";
import { CreatePrivateRoomDto, CreateRoomDto } from "./dto/room.dto";
import { UserService } from "src/user/services/user.service";
import { BadRequestException, Body, 
    Controller, 
    Delete, 
    Get,
    Logger, 
    NotFoundException, 
    Param, 
    ParseIntPipe, 
    Post, 
    Put, 
    Query,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import { RoomQueryDto } from "./dto/room.query.dto";
import { uploadRoomAvatarSettings } from "../common/config/upload-avatar.config";
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidatorPipe } from "../common/validators/filetype-validator.class";
import * as fs from 'fs';
import { Express } from 'express';
import { UserCreds } from "src/common/decorators/user-cred.decorator";
import { UserCredsDto } from "src/common/dtos/user.creds.dto";
import { RoomUserCountQueryDto } from "./dto/room-user-count.query.dto";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly userService: UserService,
    ) { 
        this.roomLogger = new Logger(RoomController.name);
    }
    private readonly roomLogger: Logger;

    @Get()
    public async findAllRooms(@Query() queryParams: RoomQueryDto): Promise<RoomEntity[] | [RoomEntity[], number]> {
        if (queryParams.count)
            return await this.roomService.findAndCountAllRooms(queryParams);
        return await this.roomService.findAllRooms(queryParams);
    }

    @Get('user_count')
    public async findRoomUserCount(@Query() queryParams: RoomUserCountQueryDto): Promise<[RoomEntity[], number]> {
        return await this.roomService.findAllRoomsUserCount(queryParams);
    }

    @Get(':room_id([0-9]+)')
    public async findOne(@Param('room_id', ParseIntPipe) id: number): Promise<RoomEntity> {
        const room: RoomEntity = await this.roomService.findOne(id);

        if (room === null) {
            this.roomLogger.error(`Room with id ${id} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return room;
    }

    @Get(':room_name([A-Za-z]{1}[A-Za-z0-9_]{0,14})')
    public async findByName(@Param('room_name') roomName: string): Promise<RoomEntity> {
        const room: RoomEntity = await this.roomService.findByName(roomName);

        if (room === null) {
            this.roomLogger.error(`Room with name ${roomName} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return room;
    }

    @Get(':room_id/owner')
    public async findRoomOwner(@Param('room_id', ParseIntPipe) id: number): Promise<UserEntity> {
        const user: UserEntity = await this.roomService.findRoomOwner(id);

        if (user === null) {
            this.roomLogger.error(`Room with id ${id} not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        return user;
    }

    @Put(':room_id/owner/:owner_id')
    public async updateRoomOwner(
        @Param('room_id', ParseIntPipe) id: number,
        @Param('owner_id', ParseIntPipe) newOwnerId: number
    ): Promise<RoomEntity> {
        const room: RoomEntity = await this.roomService.findOne(id);

        if (room === null) {
            this.roomLogger.error(`No room with id ${id} present in database`);
            throw new BadRequestException('resource not found in database');
        }
        if (await this.userService.findOne(newOwnerId) === null) {
            this.roomLogger.error(`No user with id ${newOwnerId} present in database`);
            throw new BadRequestException('resource not found in database');
        }
        if (await this.roomService.validateAdmin(newOwnerId, id) === false) {
            this.roomLogger.error(`User with id ${newOwnerId} is not allowed to be owner`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.roomService.updateRoom(id, { ownerId: newOwnerId });
    }

    @Post()
    public async createRoom(
        @Body() dto: CreateRoomDto,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<RoomEntity> {
        const { roomName } = dto;
        
        if (await this.roomService.findOneRoomByName(roomName) !== null) {
            this.roomLogger.error(`room with name ${roomName} already in database`);
            throw new BadRequestException('room cannot contain duplicate name');
        }
        return await this.roomService.createRoom({ 'ownerId': userCreds.id, 'roomName': roomName });
    }

    @Post('private')
    public async createPrivateRoom(
        @Body() dto: CreatePrivateRoomDto,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<RoomEntity> {
        const { roomName, password } = dto;
        const { id: ownerId } = userCreds;

        if (await this.userService.findOne(ownerId) === null) {
            this.roomLogger.error(`No user with id ${ownerId} found in database`);
            throw new BadRequestException('user not found in database');
        }
        if (await this.roomService.findOneRoomByName(roomName) !== null) {
            this.roomLogger.error(`Room with name ${roomName} already exists in database`);
            throw new BadRequestException('room cannot contain duplicate name');
        }
        return await this.roomService.createPrivateRoom({ 
            'ownerId': ownerId,
            'roomName': roomName,
            'password': password
        });
    }


    /* required room owner || web admin */
    @Delete(':room_id')
    public async removeRoom(@Param('room_id', ParseIntPipe) id: number): Promise<void> {
        const room: RoomEntity = await this.roomService.findOne(id);

        if (room === null) {
            this.roomLogger.error(`No room with id ${id} present in database`);
            throw new NotFoundException('no resource to delete');
        }
        return await this.roomService.removeRoom(room);
    }

    /* must be owner */
    @Post(':room_id/avatar')
    @UseInterceptors(
        FileInterceptor('avatar', uploadRoomAvatarSettings)
    )
    public async uploadRoomAvatar
        (
            @Param('room_id', ParseIntPipe) id: number,
            @UploadedFile(FileTypeValidatorPipe) avatar: Express.Multer.File
        ): Promise<RoomEntity> {

            const room = await this.roomService.findOne(id);

        if ( room === null) {
            fs.unlinkSync(avatar.path);
            throw new BadRequestException('no room in db');
        }
        const photoUrl: string = `http://localhost:3000/${avatar.path}`;

        return await this.roomService.updateRoom(id, { photoUrl: photoUrl })
    }

    @Put(':room_id')
    public async upload
        (
            @Param('room_id', ParseIntPipe) id: number,
            @Body() dto,
        ): Promise<RoomEntity> {

        const room = await this.roomService.findOne(id);

        if (room === null) {
            this.roomLogger.error(`No room present with id ${id}`);
            throw new BadRequestException('resource does not exist');
        }

        console.log('ROOM NAME', dto);
        room.roomName = dto.roomName;

        return await this.roomService.updateRoom(id, room);
    }

    /* must be owner */
    @Delete(':room_id/avatar')
    public async deleteRoomAvatar(@Param('room_id', ParseIntPipe) id: number): Promise<RoomEntity> {
        const room: RoomEntity = await this.roomService.findOne(id);

        if (room === null) {
            this.roomLogger.error(`No room present with id ${id}`);
            throw new BadRequestException('resource does not exist');
        }
        const { photoUrl } = room;

        if (photoUrl === null) {
            this.roomLogger.error(`Room with id ${id} has no avatar to remove`);
            throw new NotFoundException('no resource to delete');
        }
        return await this.roomService.removeRoomAvatar(id, photoUrl);
    }
}
