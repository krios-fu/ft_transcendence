import { Injectable } from "@nestjs/common";
import { RoomRolesEntity } from "src/room_roles/entity/room_roles.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomRolesRepository extends Repository<RoomRolesEntity> { }