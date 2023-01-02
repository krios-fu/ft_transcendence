import { RoomEntity } from "./entity/room.entity";
import { RoomService } from "./room.service";
import { UserEntity } from "src/user/entities/user.entity";
import { CreateRoomDto } from "./dto/room.dto";
import { UserService } from "src/user/services/user.service";
import { UpdateResult } from "typeorm";
import { Body, 
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    HttpStatus, 
    Logger, 
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
import { uploadRoomAvatarSettings } from "src/common/config/upload-avatar.config";
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidatorPipe } from "src/common/validators/filetype-validator.class";

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
    public async findOne(@Param('room_id', ParseIntPipe) roomId: number): Promise<RoomEntity> {
        const room = await this.roomService.findOne(roomId);
        if (room === null) {
            this.roomLogger.error('Room with id ' + roomId + ' not found in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        return room;
    }

    @Get(':room_id/owner')
    public async findOneOwner(@Param('room_id', ParseIntPipe) roomId: number): Promise<UserEntity> {
        return await this.roomService.findRoomOwner(roomId)
    }

    @Put(':room_id/owner/:owner_id')
    public async updateRoomOwner(
        @Param('room_id', ParseIntPipe)  roomId: number,
        @Param('owner_id', ParseIntPipe) newOwnerId: number
    ): Promise<UpdateResult> {
        if (await this.roomService.findOne(roomId) === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        if (await this.userService.findOne(newOwnerId) === null) {
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomService.updateRoom(roomId, { ownerId: newOwnerId });
    }

    @Post()
    public async createRoom(@Body() dto: CreateRoomDto): Promise<RoomEntity> {
        const { roomName, ownerId } = dto;
        if (await this.userService.findOne(ownerId) === null) {
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        if (await this.roomService.findOneRoomByName(roomName) !== null) {
            this.roomLogger.error('room with name ' + roomName + ' already in database');
            throw new HttpException('room already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomService.createRoom(dto);
    }

    /* Destroy a room */
    /* required room owner || web admin */
    @Delete(':room_id')
    public async removeRoom(@Param('room_id', ParseIntPipe) id: number): Promise<void> {
        return await this.roomService.removeRoom(id);
        /* need to remove avatar too */
    }

    /* upload a room avatar */
    @Post(':room_id/avatar')
    @UseInterceptors(FileInterceptor(
        'avatar', uploadRoomAvatarSettings
    ))
    public async uploadRoomAvatar
        (
            @Param('room_id', ParseIntPipe) roomId: number,
            @UploadedFile(FileTypeValidatorPipe) avatar: Express.Multer.File
        ): Promise<UpdateResult> {
        console.log(`[uploadRoomAvatar] debug: ${avatar.path}`);
        /* check if room exists needed, not sure if here or in interceptor */
        return this.roomService.updateRoom(roomId, { photoUrl: avatar.path })
    }

    /* remove a room avatar */
    @Delete(':room_id/avatar')
    public async deleteRoomAvatar(@Param('room_id', ParseIntPipe) roomId: number): Promise<UpdateResult> {
        /* same as above */
        return this.roomService.updateRoom(roomId, { photoUrl: null })
    }
}
