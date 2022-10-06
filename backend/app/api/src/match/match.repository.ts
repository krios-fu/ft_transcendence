import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { MatchEntity } from "./match.entity";

@Injectable()
export class    MatchRepository extends Repository<MatchEntity> {}
