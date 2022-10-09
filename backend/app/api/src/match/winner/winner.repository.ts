import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { WinnerEntity } from "./winner.entity";

@Injectable()
export class    WinnerRepository extends Repository<WinnerEntity> {}
