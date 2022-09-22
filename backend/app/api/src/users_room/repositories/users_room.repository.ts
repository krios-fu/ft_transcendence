import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UsersRoomEntity } from "../entities/users_room.entity";

@Injectable()
export class UsersRoomRepository extends Repository<UsersRoomEntity> { }