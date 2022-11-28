import { UserService } from "src/user/user.service";
import { RolesRepository } from "./repositories/roles.repository";
import { RoomEntity } from "./entities/room.entity";
import { RoomMapper } from "./room.mapper";
import { RoomRepository } from "./repositories/room.repository";
import { Roles } from "./roles.enum";
import { RoleInfoDto } from "./dto/role-info.dto";
import { LoginInfoDto } from "./dto/login-info.dto";
export declare class RoomService {
    private roomRepository;
    private rolesRepository;
    private roomMapper;
    private userService;
    constructor(roomRepository: RoomRepository, rolesRepository: RolesRepository, roomMapper: RoomMapper, userService: UserService);
    getAllRooms(): Promise<RoomEntity[]>;
    findOne(name: string): Promise<RoomEntity>;
    joinRoom(roomLogin: LoginInfoDto): Promise<RoomEntity>;
    createRoom(roomLogin: LoginInfoDto): Promise<RoomEntity>;
    loginToRoom(loginInfo: LoginInfoDto): Promise<boolean>;
    getUserRole(user: string, room: string): Promise<Roles>;
    authRole(userRoleCreds: RoleInfoDto, allowedRole: Roles): Promise<boolean>;
}
