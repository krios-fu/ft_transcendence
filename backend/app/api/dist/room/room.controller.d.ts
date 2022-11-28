import { RoomDto } from "./dto/room.dto";
import { RoomEntity } from "./entities/room.entity";
import { RoomService } from "./room.service";
import { IRequestUser } from "src/interfaces/request-user.interface";
import { LoginInfoDto } from "./dto/login-info.dto";
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    joinRoom(loginInfo: LoginInfoDto): Promise<RoomEntity>;
    createRoom(req: IRequestUser, roomDto: RoomDto): Promise<RoomEntity>;
    getRoom(name: string): Promise<RoomEntity>;
    getAllRooms(): Promise<RoomEntity[]>;
}
