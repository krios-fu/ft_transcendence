import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomRoleDto } from './create-room_role.dto';

export class UpdateRoomRoleDto extends PartialType(CreateRoomRoleDto) {}
