import { RoomEntity } from "./entity/room.entity";
import { RoomService } from "./room.service";
import { UserEntity } from "../user/entities/user.entity";
import { CreateRoomDto } from "./dto/room.dto";
import { UserService } from "../user/services/user.service";
import { UpdateResult } from "typeorm";
import { BadRequestException, Body, 
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    HttpStatus, 
    Logger, 
    NotFoundException, 
    Param, 
    ParseIntPipe, 
    Post, 
    Put, 
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { RoomQueryDto } from "./dto/room.query.dto";
import { uploadRoomAvatarSettings } from "../common/config/upload-avatar.config";
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidatorPipe } from "../common/validators/filetype-validator.class";
import * as fs from 'fs';

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
    public async findAllRooms(@Query() queryParams: RoomQueryDto): Promise<RoomEntity[]> {
        return await this.roomService.findAllRooms(queryParams);
    }

    @Get(':room_id')
    public async findOne(@Param('room_id', ParseIntPipe) id: number): Promise<RoomEntity> {
        const room = await this.roomService.findOne(id);
        if (room === null) {
            this.roomLogger.error('Room with id ' + id + ' not found in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        return room;
    }

    @Get(':room_id/owner')
    public async findOneOwner(@Param('room_id', ParseIntPipe) id: number): Promise<UserEntity> {
        return await this.roomService.findRoomOwner(id)
    }

    @Put(':room_id/owner/:owner_id')
    public async updateRoomOwner(
        @Param('room_id', ParseIntPipe)  id: number,
        @Param('owner_id', ParseIntPipe) newOwnerId: number
    ): Promise<UpdateResult> {
        if (await this.roomService.findOne(id) === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        if (await this.userService.findOne(newOwnerId) === null) {
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomService.updateRoom(id, { ownerId: newOwnerId });
    }

    @Post()
    public async createRoom(@Body() dto: CreateRoomDto): Promise<RoomEntity> {
        const { roomName, ownerId } = dto;
        /* owner of room must be provided by username in jwt payload */
        if (await this.userService.findOne(ownerId) === null) {
            throw new BadRequestException('no user in db');
        }
        if (await this.roomService.findOneRoomByName(roomName) !== null) {
            this.roomLogger.error('room with name ' + roomName + ' already in database');
            throw new HttpException('room already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomService.createRoom(dto);
    }

    /* required room owner || web admin */
    @Delete(':room_id')
    public async removeRoom(@Param('room_id', ParseIntPipe) id: number): Promise<void> {
        const room = await this.roomService.findOne(id);
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
        ): Promise<UpdateResult> {
        if (await this.roomService.findOne(id) === null) {
            fs.unlinkSync(avatar.path);
            throw new BadRequestException('no room in db');
        }
        /* bad photo url */
        const photoUrl = `http://localhost:3000/${avatar.path.replace('public/', '')}`;
        return this.roomService.updateRoom(id, { photoUrl: photoUrl })
    }

    /* must be owner */
    @Delete(':room_id/avatar')
    public async deleteRoomAvatar(@Param('room_id', ParseIntPipe) id: number): Promise<UpdateResult> {
        const room = await this.roomService.findOne(id);

        if (room === null) {
            this.roomLogger.error(`No room present with id ${id}`);
            throw new BadRequestException('no room in db');
        }
        const { photoUrl } = room;

        if (photoUrl === null) {
            this.roomLogger.error(`Room with id ${id} has no avatar to remove`);
            throw new NotFoundException('no resource to delete');
        }
        return this.roomService.removeRoomAvatar(id, photoUrl);
    }
}
