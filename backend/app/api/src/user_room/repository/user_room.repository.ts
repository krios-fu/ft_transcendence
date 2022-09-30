import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UsersRoomEntity } from "../entity/user_room.entity";

@Injectable()
export class UsersRoomRepository extends Repository<UsersRoomEntity> { }