import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserRoomEntity } from "../entity/user_room.entity";

@Injectable()
export class UserRoomRepository extends Repository<UserRoomEntity> { }