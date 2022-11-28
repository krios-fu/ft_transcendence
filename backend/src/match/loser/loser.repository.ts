import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { LoserEntity } from "./loser.entity";

@Injectable()
export class    LoserRepository extends Repository<LoserEntity> {}
