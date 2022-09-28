import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { BanEntity } from "./entity/ban.entity";

@Injectable()
export class BanRepository extends Repository<BanEntity> { }