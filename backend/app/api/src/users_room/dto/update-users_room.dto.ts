import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersRoomDto } from './create-users_room.dto';

export class UpdateUsersRoomDto extends PartialType(CreateUsersRoomDto) {}
