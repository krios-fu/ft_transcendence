import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RoomEntity } from "../entity/room.entity";

@Injectable()
export class RoomRepository extends Repository<RoomEntity> { }