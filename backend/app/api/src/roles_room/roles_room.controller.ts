import { Controller } from '@nestjs/common';
import { RolesRoomService } from './roles_room.service';

@Controller('roles-room')
export class RolesRoomController {
    constructor(private readonly rolesRoomService: RolesRoomService) { }
}
